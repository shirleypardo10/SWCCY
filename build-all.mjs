import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const projects = [
  { name: 'backend', dir: join(root, 'yameza-be') },
  { name: 'frontend', dir: join(root, 'app-web') },
];

const npmCommand = 'npm';

function runBuild(project) {
  const packageJsonPath = join(project.dir, 'package.json');

  if (!existsSync(packageJsonPath)) {
    throw new Error(`No se encontró package.json en ${project.dir}`);
  }

  console.log(`\n=== Compilando ${project.name} ===`);
  const result = spawnSync(npmCommand, ['run', 'build'], {
    cwd: project.dir,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`La compilación de ${project.name} falló con código ${result.status}`);
  }
}

try {
  projects.forEach(runBuild);
  console.log('\nCompilación completada correctamente para backend y frontend.');
} catch (error) {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
}
