#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');

const files = ['lesson1.json', 'lesson2.json', 'lesson3.json', 'lesson4.json'];

for (const file of files) {
  const filePath = join(dataDir, file);
  const raw = readFileSync(filePath, 'utf-8');
  const lesson = JSON.parse(raw);

  // Extract English from lesson title: "Lesson 1: Chinese (pinyin) (English)"
  const lessonTitleMatch = lesson.title.match(/^(.+?)\s*\(([^)]+)\)\s*\(([^)]+)\)$/);
  const lessonTitleEn = lessonTitleMatch ? lessonTitleMatch[3].trim() : '';

  // Extract English from each text title
  const textTitles = {};
  for (const text of lesson.texts || []) {
    const textTitleMatch = text.title.match(/^(.+?)\s*\(([^)]+)\)\s*\(([^)]+)\)$/);
    const titleEn = textTitleMatch ? textTitleMatch[3].trim() : '';
    textTitles[text.id] = {
      en: titleEn,
      ko: '',
      ja: ''
    };
  }

  // Add to translations if not already present
  if (!lesson.translations) {
    lesson.translations = {};
  }
  if (!lesson.translations.lessonTitle) {
    lesson.translations.lessonTitle = {
      en: lessonTitleEn,
      ko: '',
      ja: ''
    };
  }
  if (!lesson.translations.textTitles) {
    lesson.translations.textTitles = textTitles;
  }

  writeFileSync(filePath, JSON.stringify(lesson, null, 2) + '\n', 'utf-8');
  const textCount = Object.keys(textTitles).length;
  console.log(`${file}: lessonTitle="${lessonTitleEn}", textTitles=${textCount} texts`);
}
