import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

const LESSONS = ['lesson1.json', 'lesson2.json', 'lesson3.json', 'lesson4.json'];

let totalMissing = 0;
let totalFilesWithIssues = 0;

/**
 * Recursively traverse an object looking for leaf objects that have `ko` and `ja`
 * keys (indicating they're a LocalizedText node) and verify `en` is present.
 * Returns array of {path, value} for missing en.
 */
function validateLocalizedNodes(obj, path = '', results = []) {
  if (obj === null || obj === undefined || typeof obj !== 'object') return results;

  // If this object has 'ko' and 'ja' keys, it's a LocalizedText node
  if ('ko' in obj && 'ja' in obj) {
    if (!('en' in obj)) {
      results.push({ path, value: JSON.stringify(obj) });
    }
    // Don't recurse further into LocalizedText leaves
    return results;
  }

  // If it's an array, recurse each element
  if (Array.isArray(obj)) {
    // Special case: some arrays might have LocalizedText as direct children
    // e.g. formal_examples: [{ translation: { ko, ja } }]
    for (let i = 0; i < obj.length; i++) {
      validateLocalizedNodes(obj[i], `${path}[${i}]`, results);
    }
    return results;
  }

  // Recurse into object keys
  for (const [key, value] of Object.entries(obj)) {
    const childPath = path ? `${path}.${key}` : key;
    validateLocalizedNodes(value, childPath, results);
  }

  return results;
}

for (const filename of LESSONS) {
  const filePath = join(DATA_DIR, filename);
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`✗ ${filename}: Failed to parse JSON — ${e.message}`);
    totalFilesWithIssues++;
    continue;
  }

  const pack = data.translations;
  if (!pack) {
    console.error(`✗ ${filename}: No 'translations' block found`);
    totalFilesWithIssues++;
    continue;
  }

  const missing = validateLocalizedNodes(pack, '');

  // Exclude known empty templates: lesson4 has empty translations
  // Only report missing from objects that actually have content
  const meaningfulMissing = missing.filter(m => {
    // Skip entries where ko/ja are both empty strings (template placeholders)
    const v = JSON.parse(m.value);
    return v.ko !== '' || v.ja !== '';
  });

  if (meaningfulMissing.length === 0) {
    console.log(`✓ ${filename}: All en translations present`);
  } else {
    console.error(`✗ ${filename}: ${meaningfulMissing.length} missing en translation(s):`);
    for (const m of meaningfulMissing) {
      console.error(`    - ${m.path} = ${m.value}`);
      totalMissing++;
    }
    totalFilesWithIssues++;
  }
}

console.log('\n---');
if (totalFilesWithIssues === 0) {
  console.log(`✅ All ${LESSONS.length} lesson files have complete en translations.`);
  process.exit(0);
} else {
  console.error(`❌ ${totalFilesWithIssues} file(s) have ${totalMissing} missing en translation(s).`);
  process.exit(1);
}
