# en locale — Read from Lesson JSON Translations

## Overview

When the app's locale is set to `'en'`, currently `translateLessonData()` returns the lesson data unchanged (base values are shown directly). This spec describes a refactoring to make `'en'` behave the same way as `'ko'` and `'ja'`: read values from the `translations.en` block inside the lesson JSON file, rather than falling through to base values.

## Motivation

- **Consistency**: `ko` and `ja` already go through the translations system (`translations.ko`, `translations.ja`). `en` should follow the same code path.
- **Data integrity**: When `translations.en` is missing for a key, the corresponding field renders empty (enforcing data completeness).
- **Uniform architecture**: All locale data flows through the same `translateLessonData()` pipeline.

## Changes to lesson JSON data files

**Files affected:** `data/lesson1.json`, `data/lesson2.json`, `data/lesson3.json`, `data/lesson4.json`

### 1. `translations.vocabulary` — Add `en` to each word entry

Each vocabulary word in `translations.vocabulary` currently has `{ ko: "...", ja: "..." }` fields. Add an `en` field whose value equals the top-level `meaning` field of that vocabulary word.

**Example (lesson1.json):**
```json
{
  "translations": {
    "vocabulary": {
      "法律": {
        "ko": "법률",
        "ja": "法律",
        "en": "law"
      },
      "俩": {
        "ko": "둘, 두 사람",
        "ja": "二人、両方",
        "en": "two"
      }
    }
  }
}
```

Source mapping: `translations.vocabulary[word].en` = `vocabulary[n].meaning`

### 2. `translations.properNouns` — Add `en` to each entry

Each proper noun in `translations.properNouns` currently has `{ ko: "...", ja: "..." }`. Add `en` whose value equals the `meaning` field from the corresponding `texts[n].proper_nouns[n].meaning`.

**Example:**
```json
{
  "孙月": {
    "ko": "인명: 쑨웨",
    "ja": "人名: 孫月",
    "en": "Sun Yue, name of a person"
  }
}
```

Source mapping: `translations.properNouns[word].en` = `text.x.proper_nouns[n].meaning`

### 3. `translations.grammar` — Add `en` to each grammar point

Each grammar point in `translations.grammar` has:
- `formal_translation: { ko, ja }` — Add `en` (value = grammar item's `explanation` field)
- `colloquial_translation: { ko, ja }` — Add `en` (value = grammar item's `nuance` field)
- `formal_examples[]` each with `translation: { ko, ja }` — Add `en` (value = example's `translation` field)
- `colloquial_examples[]` each with `translation: { ko, ja }` — Add `en` (value = colloquial example's `translation` field)

**Example (lesson1.json):**
```json
{
  "不仅……也/还/而且……": {
    "formal_translation": {
      "ko": "그는 축구도 잘할 뿐만 아니라 성격도 좋다.",
      "ja": "彼はサッカーが上手なだけでなく、性格もよい。",
      "en": "Not only... but also..."
    },
    "colloquial_translation": {
      "ko": "얘는 축구만 잘하는 게 아니라 사람도 정말 괜찮아.",
      "ja": "こいつ、サッカーがうまいだけじゃなくて人柄もかなりいい。",
      "en": "In casual speech, '贼溜' (very smooth/skilled) and '美得冒泡' (bubbling with beauty) add a much more native flavor."
    },
    "formal_examples": [
      {
        "translation": {
          "ko": "그는 축구를 잘할 뿐만 아니라 성격도 꽤 좋아요.",
          "ja": "彼はサッカーが上手なだけでなく、性格もなかなか良いです。",
          "en": "Not only does he play football well, but his personality is also quite good."
        }
      }
    ],
    "colloquial_examples": [
      {
        "translation": {
          "ko": "그는 공도 정말 잘 차고 사람도 꽤 괜찮아요.",
          "ja": "彼はサッカーがめちゃくちゃ上手なだけでなく、人柄もかなりいいです。",
          "en": "He's not just a pro at football, he's also a really stand-up guy."
        }
      }
    ]
  }
}
```

Source mappings:
- `translations.grammar[point].formal_translation.en` = `grammar[n].explanation`
- `translations.grammar[point].colloquial_translation.en` = `grammar[n].nuance`
- `translations.grammar[point].formal_examples[i].translation.en` = `grammar[n].formal_examples[i].translation`
- `translations.grammar[point].colloquial_examples[i].translation.en` = `grammar[n].colloquial_examples[i].translation`

> **Note for lesson2.json:** Lesson 2 grammar uses singular fields (`formal_example`, `formal_translation`, `colloquial_version`, `colloquial_translation`) instead of arrays. `translateLessonData` already handles both formats in its output, but the `translations.grammar` structure (arrays and their `translation` fields) is only populated for lesson1. Lesson 2's grammar pack may be empty or non-existent. This spec focuses on the structure that already exists in `translations.grammar`.

### 4. `translations.keySentences` — Add `en` to each key sentence

Each key sentence has:
- `translation: { ko, ja }` — Add `en` (value = sentence's `translation`)
- `colloquial_translation: { ko, ja }` — Add `en` (value = sentence's `colloquial_translation`)
- `context: { ko, ja }` — Add `en` (value = sentence's `context`)

**Example:**
```json
{
  "虽然我们认识的时间不长，但我<b>从来没</b>这么快乐过。": {
    "translation": {
      "ko": "우리가 알게 된 지는 오래되지 않았지만, 나는 이렇게 행복했던 적이 없다.",
      "ja": "知り合ってまだ長くないけれど、こんなに幸せだったことはない。",
      "en": "Although we haven't known each other for long, I've never been this happy."
    },
    "colloquial_translation": {
      "ko": "알게 된 지 얼마 안 됐는데도 이렇게 행복한 건 처음이야.",
      "ja": "知り合ってまだそんなに経ってないのに、こんなに幸せなのは初めてだ。",
      "en": "I haven't been this happy in my entire life!"
    },
    "context": {
      "ko": "새로운 연애에서 느끼는 큰 행복을 표현할 때.",
      "ja": "新しい恋愛で感じる大きな幸福を表すとき。",
      "en": "Expressing intense happiness in a new relationship."
    }
  }
}
```

Source mappings:
- `translations.keySentences[key].translation.en` = `key_sentences[n].translation`
- `translations.keySentences[key].colloquial_translation.en` = `key_sentences[n].colloquial_translation`
- `translations.keySentences[key].context.en` = `key_sentences[n].context`

### 5. `translations.texts` — Add `en` to each text line

Each text has `lines` mapped by index, each line has `translation: { ko, ja }`. Add `en` whose value equals the line's `translation` field.

**Example:**
```json
{
  "1": {
    "lines": {
      "0": {
        "translation": {
          "ko": "네 남자친구 리진이 너랑 같은 학교라던데, 네 동창이야?",
          "ja": "あなたの彼氏の李進って、あなたと同じ学校なんでしょう？同級生なの？",
          "en": "I heard that your boyfriend Li Jin is from the same school as you. Is he your classmate?"
        }
      }
    }
  }
}
```

Source mapping: `translations.texts[id].lines[index].translation.en` = `texts[n].content[index].translation`

## Changes to TypeScript code

**Files affected:** `src/utils/lessonTranslations.ts`

### 1. Modify `LocalizedText` type

```typescript
// BEFORE:
type LocalizedText = Partial<Record<Exclude<AppLanguage, 'en'>, string>>;

// AFTER:
type LocalizedText = Partial<Record<AppLanguage, string>>;
```

This allows `LocalizedText` to hold `en`, `ko`, and `ja` values.

### 2. Modify `pickLocalized` function

```typescript
// BEFORE:
function pickLocalized(baseValue: string | undefined, localized: LocalizedText | undefined, language: AppLanguage) {
  if (language === 'en') return baseValue;
  return localized?.[language] ?? baseValue;
}

// AFTER:
function pickLocalized(localized: LocalizedText | undefined, language: AppLanguage) {
  return localized?.[language];
}
```

Key changes:
- Remove the `baseValue` parameter (no longer needed)
- Remove the early return for `'en'`
- No fallback to `baseValue` — if the translation key is missing, returns `undefined` (renders empty)

### 3. Modify `translateLessonData` function

```typescript
// BEFORE:
export function translateLessonData<T extends { ... }>(lessonData: T, language: AppLanguage): T {
  if (language === 'en') return lessonData;
  // ... merge translations for ko/ja ...

// AFTER:
export function translateLessonData<T extends { ... }>(lessonData: T, language: AppLanguage): T {
  const pack = lessonData.translations;
  if (!pack) return lessonData;
  // ... merge translations for en/ko/ja uniformly ...
```

Key changes:
- Remove the `if (language === 'en') return lessonData;` early return
- Remove `?? item.xxx` fallbacks (e.g., `?? item.meaning`)
- Update all `pickLocalized` calls to remove the first argument (baseValue)
- The exact same transformation pipeline runs for all languages

### 4. Updated `pickLocalized` calls inside `translateLessonData`

**Vocabulary:**
```typescript
// BEFORE:
meaning: pickLocalized(item.meaning, pack.vocabulary?.[item.word], language) ?? item.meaning
// AFTER:
meaning: pickLocalized(pack.vocabulary?.[item.word], language)
```

**Grammar:**
```typescript
// BEFORE:
explanation: pickLocalized(item.explanation, grammarPack?.formal_translation, language) ?? item.explanation,
nuance: pickLocalized(item.nuance, grammarPack?.colloquial_translation, language) ?? item.nuance,
formal_translation: pickLocalized(item.formal_translation, grammarPack?.formal_translation, language) ?? item.formal_translation,
colloquial_translation: pickLocalized(item.colloquial_translation, grammarPack?.colloquial_translation, language) ?? item.colloquial_translation,
formal_examples: item.formal_examples?.map((example: any, index: number) => ({
  ...example,
  translation: pickLocalized(example.translation, grammarPack?.formal_examples?.[index]?.translation, language) ?? example.translation
})),
colloquial_examples: item.colloquial_examples?.map((example: any, index: number) => ({
  ...example,
  translation: pickLocalized(example.translation, grammarPack?.colloquial_examples?.[index]?.translation, language) ?? example.translation
}))

// AFTER:
explanation: pickLocalized(grammarPack?.formal_translation, language),
nuance: pickLocalized(grammarPack?.colloquial_translation, language),
formal_translation: pickLocalized(grammarPack?.formal_translation, language),
colloquial_translation: pickLocalized(grammarPack?.colloquial_translation, language),
formal_examples: item.formal_examples?.map((example: any, index: number) => ({
  ...example,
  translation: pickLocalized(grammarPack?.formal_examples?.[index]?.translation, language)
})),
colloquial_examples: item.colloquial_examples?.map((example: any, index: number) => ({
  ...example,
  translation: pickLocalized(grammarPack?.colloquial_examples?.[index]?.translation, language)
}))
```

**Key Sentences:**
```typescript
// BEFORE:
translation: pickLocalized(item.translation, pack.keySentences?.[item.sentence]?.translation, language) ?? item.translation,
colloquial_translation: pickLocalized(item.colloquial_translation, pack.keySentences?.[item.sentence]?.colloquial_translation, language) ?? item.colloquial_translation,
context: pickLocalized(item.context, pack.keySentences?.[item.sentence]?.context, language) ?? item.context

// AFTER:
translation: pickLocalized(pack.keySentences?.[item.sentence]?.translation, language),
colloquial_translation: pickLocalized(pack.keySentences?.[item.sentence]?.colloquial_translation, language),
context: pickLocalized(pack.keySentences?.[item.sentence]?.context, language)
```

**Texts:**
```typescript
// BEFORE (content lines):
translation: pickLocalized(line.translation, pack.texts?.[text.id]?.lines?.[index]?.translation, language) ?? line.translation
// AFTER:
translation: pickLocalized(pack.texts?.[text.id]?.lines?.[index]?.translation, language)
```

**Text vocabulary and proper_nouns:**
```typescript
// BEFORE:
meaning: pickLocalized(item.meaning, pack.vocabulary?.[item.word], language) ?? item.meaning
meaning: pickLocalized(item.meaning, pack.properNouns?.[item.word], language) ?? item.meaning
// AFTER:
meaning: pickLocalized(pack.vocabulary?.[item.word], language)
meaning: pickLocalized(pack.properNouns?.[item.word], language)
```

## Data integrity considerations

- After this change, every locale (`en`, `ko`, `ja`) must have complete `translations` entries for all fields used by `translateLessonData`.
- Missing `en` translations will render as empty strings/undefined in the UI.
- This enforces strict data completeness: when adding a new lesson JSON, the `translations` block must include `en`, `ko`, and `ja` for every field.

## Out of scope

- `uiCopy.ts` (UI chrome copy: button labels, tab names, footer text) — stays as-is, not moved into lesson JSON.
- The `LessonTranslationPack` type in `lessonTranslations.ts` — its structure stays the same, only the `LocalizedText` inner type changes.
- Adding new lesson JSON files — only modifying existing ones and the code.

## Implementation order

1. Modify `src/utils/lessonTranslations.ts`:
   - Update `LocalizedText` type
   - Rewrite `pickLocalized`
   - Rewrite `translateLessonData` (remove en early return, remove fallbacks)

2. Add `en` translations to all 4 lesson JSON files:
   - `data/lesson1.json` — all 5 sections (vocabulary, properNouns, grammar, keySentences, texts)
   - `data/lesson2.json` — all 5 sections
   - `data/lesson3.json` — all 5 sections
   - `data/lesson4.json` — all 5 sections

3. Update `data/lesson_template.md` to reflect the new structure with `en` fields.

4. Typecheck and verify the app works correctly with `en` locale.
