import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const packageLockPath = path.join(rootDir, 'package-lock.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function bumpPatch(version) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Unsupported version format: ${version}`);
  }

  parts[2] += 1;
  return parts.join('.');
}

const packageJson = readJson(packageJsonPath);
const packageLock = readJson(packageLockPath);
const nextVersion = bumpPatch(packageJson.version);

packageJson.version = nextVersion;
packageLock.version = nextVersion;

if (packageLock.packages?.['']) {
  packageLock.packages[''].version = nextVersion;
}

writeJson(packageJsonPath, packageJson);
writeJson(packageLockPath, packageLock);

process.stdout.write(`${nextVersion}\n`);
