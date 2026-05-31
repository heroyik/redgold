import { readFileSync, writeFileSync } from 'fs';

const LESSONS = ['lesson1.json', 'lesson2.json', 'lesson3.json', 'lesson4.json'];

for (const filename of LESSONS) {
  const filePath = `data/${filename}`;
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));

  const pack = data.translations;
  if (!pack) {
    console.log(`${filename}: No translations block, skipping`);
    continue;
  }

  // Build lookup maps from base data
  const vocabMap = new Map();
  for (const v of data.vocabulary || []) {
    vocabMap.set(v.word, v.meaning);
  }

  const grammarMap = new Map();
  for (const g of data.grammar || []) {
    grammarMap.set(g.point, g);
  }

  const keySentenceMap = new Map();
  for (const ks of data.key_sentences || []) {
    keySentenceMap.set(ks.sentence, ks);
  }

  const textContentMap = new Map();
  const textVocabMaps = new Map(); // word -> meaning from text-level vocab
  const properNounMaps = new Map(); // word -> meaning from text-level proper_nouns
  for (const t of data.texts || []) {
    textContentMap.set(t.id, t.content || []);
    for (const v of t.vocabulary || []) {
      textVocabMaps.set(v.word, v.meaning);
    }
    for (const pn of t.proper_nouns || []) {
      properNounMaps.set(pn.word, pn.meaning);
    }
  }

  let addedCount = 0;

  // 1. Add en to translations.vocabulary
  if (pack.vocabulary) {
    for (const [word, entry] of Object.entries(pack.vocabulary)) {
      if (!entry.en) {
        const meaning = vocabMap.get(word);
        if (meaning) {
          entry.en = meaning;
          addedCount++;
        }
      }
    }
  }

  // 2. Add en to translations.properNouns
  if (pack.properNouns) {
    for (const [word, entry] of Object.entries(pack.properNouns)) {
      if (!entry.en) {
        const meaning = properNounMaps.get(word);
        if (meaning) {
          entry.en = meaning;
          addedCount++;
        }
      }
    }
  }

  // 3. Add en to translations.grammar
  if (pack.grammar) {
    for (const [point, entry] of Object.entries(pack.grammar)) {
      const grammar = grammarMap.get(point);
      if (!grammar) continue;

      if (entry.formal_translation && !entry.formal_translation.en) {
        if (grammar.explanation) {
          entry.formal_translation.en = grammar.explanation;
          addedCount++;
        }
      }

      if (entry.colloquial_translation && !entry.colloquial_translation.en) {
        if (grammar.nuance) {
          entry.colloquial_translation.en = grammar.nuance;
          addedCount++;
        }
      }

      if (entry.formal_examples) {
        for (let i = 0; i < entry.formal_examples.length; i++) {
          const ex = entry.formal_examples[i];
          if (ex.translation && !ex.translation.en) {
            const baseEx = grammar.formal_examples?.[i];
            if (baseEx?.translation) {
              ex.translation.en = baseEx.translation;
              addedCount++;
            }
          }
        }
      }

      if (entry.colloquial_examples) {
        for (let i = 0; i < entry.colloquial_examples.length; i++) {
          const ex = entry.colloquial_examples[i];
          if (ex.translation && !ex.translation.en) {
            const baseEx = grammar.colloquial_examples?.[i];
            if (baseEx?.translation) {
              ex.translation.en = baseEx.translation;
              addedCount++;
            }
          }
        }
      }
    }
  }

  // 4. Add en to translations.keySentences
  if (pack.keySentences) {
    for (const [sentence, entry] of Object.entries(pack.keySentences)) {
      const ks = keySentenceMap.get(sentence);
      if (!ks) continue;

      if (entry.translation && !entry.translation.en) {
        if (ks.translation) {
          entry.translation.en = ks.translation;
          addedCount++;
        }
      }

      if (entry.colloquial_translation && !entry.colloquial_translation.en) {
        // Base uses 'colloquial_equivalent', translations use 'colloquial_translation'
        if (ks.colloquial_equivalent) {
          entry.colloquial_translation.en = ks.colloquial_equivalent;
          addedCount++;
        }
      }

      if (entry.context && !entry.context.en) {
        if (ks.context) {
          entry.context.en = ks.context;
          addedCount++;
        }
      }
    }
  }

  // 5. Add en to translations.texts
  if (pack.texts) {
    for (const [textId, textEntry] of Object.entries(pack.texts)) {
      const content = textContentMap.get(Number(textId));
      if (!content || !textEntry.lines) continue;

      for (const [lineIndexStr, lineEntry] of Object.entries(textEntry.lines)) {
        const lineIndex = Number(lineIndexStr);
        if (lineEntry.translation && !lineEntry.translation.en) {
          const baseLine = content[lineIndex];
          if (baseLine?.translation) {
            lineEntry.translation.en = baseLine.translation;
            addedCount++;
          }
        }
      }
    }
  }

  // Write back
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`${filename}: Added ${addedCount} en translations`);
}
