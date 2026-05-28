import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import readline from 'node:readline';

const root = process.cwd();
function resolvePackageManagerCmd() {
  try {
    // Prefer pnpm if available (it ensures local binaries like `nest` and `next` are found)
    const check = spawnSync(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', ['-v'], {
      stdio: 'ignore',
      shell: process.platform === 'win32',
    });

    if (check.status === 0) {
      return process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    }
  } catch {
    // fallthrough
  }

  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

const npmCommand = resolvePackageManagerCmd();
const frontendDistDir = '.next-root-dev';
const frontendNextDevDir = join(root, 'app-web', frontendDistDir, 'dev');

const children = new Map();
let shuttingDown = false;

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();

      if (typeof address !== 'object' || address === null) {
        server.close(() => reject(new Error('No se pudo reservar un puerto libre')));
        return;
      }

      const { port } = address;
      server.close(() => resolve(port));
    });
  });
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function terminateProcess(pid) {
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(pid), '/F'], {
      stdio: 'inherit',
      shell: false,
    });
    return;
  }

  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    // Ignore errors here; the lock cleanup below will handle dead processes.
  }
}

async function waitForProcessExit(pid, attempts = 20, delayMs = 100) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (!isProcessRunning(pid)) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return !isProcessRunning(pid);
}

async function clearStaleFrontendLock() {
  const lockFilePath = join(frontendNextDevDir, 'lock');

  if (!existsSync(lockFilePath)) {
    return;
  }

  try {
    const lockContent = readFileSync(lockFilePath, 'utf8');
    const serverInfo = JSON.parse(lockContent);
    const pid = Number(serverInfo?.pid);

    if (Number.isFinite(pid) && pid > 0) {
      if (isProcessRunning(pid)) {
        console.log(`[frontend] Detecté una sesión previa de Next (${pid}); la cierro antes de arrancar.`);
        terminateProcess(pid);
        await waitForProcessExit(pid);
      }
    }
  } catch {
    // If the lock file is malformed, remove it so the new dev server can recreate it.
  }

  try {
    rmSync(lockFilePath, { force: true });
  } catch {
    // Ignore cleanup failures; Next will report any real issue on startup.
  }
}

function startService(service) {
  const child = spawn(npmCommand, service.args, {
    cwd: service.dir,
    shell: process.platform === 'win32' ? true : false,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      ...(service.env ?? {}),
    },
  });

  const prefix = `[${service.name}]`;
  const forward = (stream) => {
    const rl = readline.createInterface({ input: stream });
    rl.on('line', (line) => {
      process.stdout.write(`${prefix} ${line}\n`);
    });
    return rl;
  };

  const stdoutRl = forward(child.stdout);
  const stderrRl = forward(child.stderr);

  child.on('exit', (code, signal) => {
    stdoutRl.close();
    stderrRl.close();

    if (shuttingDown) {
      return;
    }

    console.error(`\n${prefix} salió con código ${code ?? 'n/a'}${signal ? ` por señal ${signal}` : ''}`);
    shutdown(code ?? 1);
  });

  child.on('error', (error) => {
    console.error(`\n${prefix} no pudo arrancar: ${error.message}`);
    shutdown(1);
  });

  children.set(service.name, child);
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children.values()) {
    if (!child.killed) {
      child.kill(process.platform === 'win32' ? 'SIGTERM' : 'SIGTERM');
    }
  }

  setTimeout(() => process.exit(exitCode), 200);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

async function main() {
  const backendPort = await getFreePort();
  const frontendPort = await getFreePort();

  await clearStaleFrontendLock();

  const services = [
    {
      name: 'backend',
      dir: join(root, 'yameza-be'),
      args: ['run', 'start:dev'],
      env: {
        PORT: String(backendPort),
      },
    },
    {
      name: 'frontend',
      dir: join(root, 'app-web'),
      args: ['run', 'dev'],
      env: {
        NEXT_DIST_DIR: frontendDistDir,
        PORT: String(frontendPort),
        NEXT_PUBLIC_API_URL: `http://localhost:${backendPort}`,
      },
    },
  ];

  for (const service of services) {
    startService(service);
  }

  console.log('Iniciando backend y frontend en paralelo...');
  console.log(`Backend: http://localhost:${backendPort}`);
  console.log(`Frontend: http://localhost:${frontendPort}`);
}

main().catch((error) => {
  console.error(`No se pudo iniciar el entorno de desarrollo: ${error.message}`);
  process.exit(1);
});
