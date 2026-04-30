# HSK 4 Content Enrichment Cookbook

This cookbook defines the standard procedure for converting HSK 4 textbook images into high-quality, pedagogically enriched JSON data for the learning application. Follow these rules to ensure consistency and a premium learning experience.

## 1. Data Structure Overview (`lessonX.json`)

The JSON file must follow this exact schema:

```json
{
  "lessonId": number,
  "title": "Lesson X: [Chinese Title] ([English Title])",
  "vocabulary": [ { "word", "pinyin", "meaning" }, ... ],
  "grammar": [ { 
    "point", "explanation", 
    "formal_example", "formal_pinyin", "formal_translation",
    "colloquial_pattern", "colloquial_version", "colloquial_pinyin", "colloquial_translation", 
    "nuance" 
  }, ... ],
  "key_sentences": [ { "sentence", "pinyin", "translation", "colloquial_equivalent", "colloquial_pinyin", "context" }, ... ],
  "texts": [ { "id", "title", "content": [ { "speaker", "text", "pinyin", "translation" }, ... ] }, ... ]
}
```

---

## 2. Extraction & Enrichment Rules

### A. Vocabulary (`vocabulary`)
- **Source**: Extract directly from the "New Words" list in the images.
- **Requirement**: Must include accurate Pinyin (with tone marks) and concise English meanings.

### B. Grammar (`grammar`) - *Crucial Step*
- **Source**: "Notes" section in the images.
- **Formal Side**: 
    - Use the example sentence from the textbook.
    - **Bold Pattern**: Wrap the core grammar pattern in `<b>` tags.
    - Add Pinyin and Translation.
- **Colloquial Side (Enrichment)**:
    - **Pattern**: Provide a natural, spoken alternative (e.g., `不光` instead of `不仅`).
    - **Version**: Create a *new* sentence that feels "Living" (e.g., using `贼`, `给力`, `领证`).
    - **Bold Pattern**: Wrap the colloquial pattern in `<b>` tags.
- **Nuance**: Explain *why* the colloquial version is used or what specific vibe it gives (e.g., "more expressive," "Beijing dialect influence," "common among friends").

### C. Mastery (`key_sentences`)
- **Source**: Select 4-5 "Golden Sentences" from the textbook dialogues/monologues that are highly versatile.
- **Pairing**:
    - **Golden Sentence**: The textbook version (Formal/Standard).
    - **Living Language**: A natural, spoken equivalent that a native speaker would actually say in that context.
- **Highlighting**: If a grammar pattern from the current lesson is used, bold it with `<b>`.

### D. Texts (`texts`)
- **Source**: Dialogue/Monologue boxes in the images.
- **Title**: Use the Chinese title + English translation.
- **Enrichment**: 
    - Add Pinyin for *every* line.
    - Add English translation for *every* line.
    - **Pattern Highlight**: Scan the text for the 5 grammar points of the lesson. Wrap them in `<b>` tags.

---

## 3. Highlighting & Styling Standards

### `<b>` Tag Policy
- **Formal Contexts**: Highlights the "Textbook Pattern". In the UI, this is styled in **Imperial Red (#8B0000)**.
- **Colloquial Contexts**: Highlights the "Natural Slang/Pattern". In the UI, this is styled in **Gold (#D4AF37)**.
- **Coverage**: Apply to `grammar.formal_example`, `grammar.colloquial_version`, `key_sentences.sentence`, `key_sentences.colloquial_equivalent`, and `texts.content[].text`.

---

## 4. UI Rendering Checklist

Before finalizing a chapter, ensure:
1. [ ] **No Pinyin Gaps**: Every Chinese sentence has a corresponding `pinyin` field.
2. [ ] **No Broken Layouts**: Check if long sentences in `GrammarCard` cause overflow.
3. [ ] **Tone Consistency**: Ensure Pinyin tone marks are consistent (e.g., `v` vs `ü`).
4. [ ] **Aesthetic Alignment**: Colors must follow the "Modern Han Elegant" theme (Deep Red, Gold, Off-white).

---

## 5. Automation Strategy
When generating `lessonX.json` for new chapters:
1. Feed the image OCR/descriptions to the model.
2. Instruct the model to "Enrich as per the `json_cookbook.md` standards."
3. Specifically ask for "Creative and authentic colloquial versions" to avoid generic AI-sounding Chinese.
