import fs from 'node:fs';
import path from 'node:path';

const [, , messageFile] = process.argv;

if (!messageFile) {
  process.exit(1);
}

const packageJsonPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'package.json');
const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version;
const versionTag = `v${version}`;
const message = fs.readFileSync(messageFile, 'utf8');

if (!message.includes(versionTag)) {
  console.error(`Commit message must include ${versionTag}.`);
  process.exit(1);
}
