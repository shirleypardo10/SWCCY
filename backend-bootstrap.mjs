import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const backendDir = join(root, 'yameza-be');
const composeFile = join(backendDir, 'docker-compose.yml');
const npmCommand = 'npm';

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`El comando ${command} ${args.join(' ')} falló con código ${result.status}`);
  }
}

function runDockerCompose() {
  const dockerComposeBinary = process.platform === 'win32' ? 'docker.exe' : 'docker';
  const dockerComposeResult = spawnSync(dockerComposeBinary, ['compose', '-f', composeFile, 'up', '-d'], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });

  if (!dockerComposeResult.error && dockerComposeResult.status === 0) {
    return;
  }

  const fallbackBinary = process.platform === 'win32' ? 'docker-compose.exe' : 'docker-compose';
  const fallbackResult = spawnSync(fallbackBinary, ['-f', composeFile, 'up', '-d'], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });

  if (fallbackResult.error) {
    throw fallbackResult.error;
  }

  if (fallbackResult.status !== 0) {
    throw new Error('No se pudo levantar MongoDB con Docker Compose.');
  }
}

if (!existsSync(composeFile)) {
  throw new Error(`No se encontró el archivo de Docker Compose en ${composeFile}`);
}

console.log('Levantando servicios de base de datos...');
runDockerCompose();

console.log('\nEjecutando seed del backend...');
run(npmCommand, ['--prefix', 'yameza-be', 'run', 'seed']);

console.log('\nIniciando backend...');
run(npmCommand, ['--prefix', 'yameza-be', 'run', 'start']);
