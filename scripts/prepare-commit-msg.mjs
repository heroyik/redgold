import fs from 'node:fs';
import path from 'node:path';

const [, , messageFile, source] = process.argv;

if (!messageFile || source === 'merge') {
  process.exit(0);
}

const packageJsonPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'package.json');
const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version;
const versionTag = `v${version}`;
const message = fs.readFileSync(messageFile, 'utf8');

if (message.includes(versionTag)) {
  process.exit(0);
}

const lines = message.split('\n');
const firstContentIndex = lines.findIndex(line => line.trim() !== '' && !line.startsWith('#'));

if (firstContentIndex === -1) {
  fs.writeFileSync(messageFile, `${versionTag} `);
  process.exit(0);
}

lines[firstContentIndex] = `${versionTag} ${lines[firstContentIndex]}`.trimEnd();
fs.writeFileSync(messageFile, lines.join('\n'));
