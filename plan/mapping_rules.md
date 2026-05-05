# Image to JSON Mapping Rules (Lesson 1)

This document outlines the rules used to transform the scanned textbook images into the `lesson1.json` data structure.

## 1. Global Structure

| JSON Key | Source / Rule |
| :--- | :--- |
| `lessonId` | Extracted from the number in the dark square at the top-left of the page. |
| `title` | The overall lesson title (e.g., HSK 4 Lesson 1 title). |
| `vocabulary` | A comprehensive list of all "生词" (New Words) across all texts in the lesson. |
| `grammar` | Mapping of grammar explanation pages (like the "不仅" image). |
| `texts` | An array containing each dialogue or monologue section. |

---

## 2. Text / Dialogue Mapping (`texts` array)

For each numbered section in the textbook:

- **`id`**: The number in the dark square (e.g., `1`).
- **`title`**: The bold heading text (e.g., `孙月和王静聊王静的男朋友`).
- **`audio`**: Derived from the disc icon. `01-1` → `audio/01-1.mp3`.
- **`content`**: 
    - **`speaker`**: The name before the colon (e.g., `孙月`).
    - **`text`**: The Chinese text. Grammar points used in the text are wrapped in `<b>` tags.
    - **`pinyin`**: Transliteration of the text.
    - **`translation`**: English meaning of the full sentence.
- **`proper_nouns`**: Extracted from the "专有名词" (Proper Nouns) box at the bottom.
    - Includes `word`, `pinyin`, and `meaning` (e.g., "Sun Yue, name of a person").
- **`vocabulary`**: The specific "生词" (New Words) listed on the right sidebar of that page.
    - Includes part of speech (e.g., `n.`, `adj.`, `v.`).

---

## 3. Vocabulary Mapping (`vocabulary` list)

- **`word`**: The Chinese character.
- **`pinyin`**: Pinyin with tone marks.
- **`meaning`**: The English definition provided in the sidebar.

---

## 4. Grammar Mapping (`grammar` array)

Each grammar point follows this rule:

- **`point`**: The heading of the grammar section (e.g., `不仅……也/还/而且……`).
- **`explanation`**: The English explanation block.
- **`formal_example`**: The first numbered example sentence `(1)` from the "For example" section.
- **`formal_pinyin` / `formal_translation`**: Derived from the formal example.
- **`colloquial_*` (AI Enhanced)**: These fields are **generated** (not in image) to provide a natural, modern slang equivalent of the formal grammar point to help with real-world conversation.
- **`nuance` (AI Enhanced)**: Explains the difference between the formal textbook version and the colloquial version.

---

## 5. Visual Cues & Formatting

- **Emphasis**: Words that are the focus of a grammar point in the text or examples are bolded using `<b>` tags.
- **Punctuation**: Full-width Chinese punctuation is preserved in `text` fields.
- **Colloquial Logic**: 
    - Formal: `学的是法律` (Studies law)
    - Colloquial: `领证` (Registering marriage/Getting hitched) - added for context-specific richness.
