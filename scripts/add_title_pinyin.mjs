import { readFileSync, writeFileSync } from 'fs';
import { pinyin } from 'pinyin-pro';

const files = [
  'data/lesson1.json',
  'data/lesson2.json',
  'data/lesson3.json',
  'data/lesson4.json',
];

// Regex to match Chinese characters (CJK Unified Ideographs)
const CHINESE_RE = /[\u4e00-\u9fff]+/g;

function getPinyin(text) {
  return pinyin(text, { toneType: 'symbol' });
}

function addPinyinToTitle(title) {
  // Find the first English part in parentheses
  // The pattern is: Chinese (English) or Lesson N: Chinese (English)
  const match = title.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (!match) return title;

  const chinesePart = match[1].trim();
  const englishPart = match[2].trim();

  // Extract only the Chinese characters to convert
  // For lesson titles like "Lesson 1: 简单的爱情", extract "简单的爱情"
  // For text titles like "孙月和王静聊王静的男朋友", extract the whole thing
  let chineseText = '';
  if (chinesePart.includes(':')) {
    // Lesson title: "Lesson 1: 简单的爱情" -> extract after ": "
    const colonIdx = chinesePart.indexOf(':');
    chineseText = chinesePart.substring(colonIdx + 1).trim();
  } else {
    chineseText = chinesePart;
  }

  // If there's no Chinese text, skip
  if (!CHINESE_RE.test(chineseText)) return title;
  CHINESE_RE.lastIndex = 0; // Reset regex

  const pinyinStr = getPinyin(chineseText);

  return `${chinesePart} (${pinyinStr}) (${englishPart})`;
}

let totalTitles = 0;
let totalTextTitles = 0;

for (const file of files) {
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  let changed = false;

  // Process lesson title
  const newTitle = addPinyinToTitle(data.title);
  if (newTitle !== data.title) {
    console.log(`${file} — Lesson title:`);
    console.log(`  Before: ${data.title}`);
    console.log(`  After:  ${newTitle}`);
    data.title = newTitle;
    totalTitles++;
    changed = true;
  }

  // Process text titles
  for (const text of data.texts) {
    const newTextTitle = addPinyinToTitle(text.title);
    if (newTextTitle !== text.title) {
      console.log(`${file} — Text ${text.id} title:`);
      console.log(`  Before: ${text.title}`);
      console.log(`  After:  ${newTextTitle}`);
      text.title = newTextTitle;
      totalTextTitles++;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }
}

console.log(`\nDone! Updated ${totalTitles} lesson titles and ${totalTextTitles} text titles.`);
