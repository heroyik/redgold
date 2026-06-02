<p align="center">
  <img src="public/assets/logo.png" width="240" alt="Redgold Logo">
</p>

<h1 align="center">✨ REDGOLD ✨</h1>

<p align="center">
  <strong>Textbooks are mid. Master the bridge from HSK 4 to real-world talk.</strong><br>
  <em>The perfect fusion of academic precision and colloquial soul.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.9.78-B8860B?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Stack-Vite_%7C_TS_%7C_WebComponents-ff9e4d?style=for-the-badge" alt="Stack">
  <img src="https://img.shields.io/badge/Design-Modern_Han_Elegant-gold?style=for-the-badge" alt="Design">
</p>

---

## 🏮 The Philosophy: Red Meets Gold

In traditional Chinese learning, there has always been a disconnect.
- **The Red (赤)**: Represents the formal, structured HSK curriculum—essential for exams but often sounding "robotic" in real life.
- **The Gold (金)**: Represents the colloquial, native rhythm—the way people *actually* talk in the streets of Beijing or Shanghai.

**RedGold** bridges this gap. We transform the **[HSK 4 Standard Course](https://www.blcup.com/EnSeriesBook/index/8)** into a premium, interactive experience that teaches you not just *what* to say, but *how* to say it like a native.

---

## 🚀 Core Features

### 🎬 Karaoke-Style Scroll Sync
Our intelligent **Scroll Engine** in the `TextSection` component provides a seamless reading experience.
- **Forward-Only Logic**: The viewport only moves forward with the audio, preventing distracting "snaps" back to previous lines.
- **Timing Heuristics**: Calculates line changes based on character weight and audio duration for frame-perfect synchronization.

### 🏷️ Proper Nouns Support
Unlike standard HSK tools, RedGold explicitly identifies and styles **专有名词 (Proper Nouns)** — names, places, brands — with pinyin AND English meaning right there, no lookup needed. Styled in the signature **Modern Han Elegant** gold theme.

### ⚡ Smart Prefetching
Zero-latency transitions. The app predicts your learning path and pre-warms audio assets and lesson data as you browse, ensuring the next chapter is ready before you even click.

### 🎨 Modern Han Elegant UI
A premium "glassmorphic" interface designed for focus:
- **Responsive Layout**: Tailored for high-aspect-ratio mobile displays (Galaxy S26 / iPhone Pro Max).
- **Sticky Navigation**: Smooth tab switching between Vocab, Grammar, and Texts.
- **Visual Selection**: Browse lessons via high-resolution 3D-styled textbook covers.

### 🔢 Live Version Badge
The app header now shows the current version and last build date in real time — no more guessing what's deployed.

---

## 🛠 Tech Stack & Architecture

Built for performance, scalability, and the **Google Cloud** ecosystem:

- **Frontend**: [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Architecture**: **Vanilla Web Components** (Shadow DOM, 0-dependency runtime)
- **Styling**: Vanilla CSS with a centralized token system (Modern Han Elegant)
- **Backend**: [Firebase](https://firebase.google.com/) (Hosting, Auth, Firestore ready)
- **CI/CD**: GitHub Actions deploys `main` to GitHub Pages. Local git hooks bump the patch version (`+0.0.1`) before each commit and stamp that version into the commit message.

---

## 📂 Project Structure

```bash
redgold/
├── data/               # HSK 4 Lesson JSONs (Vocab, Grammar, Texts)
├── plan/               # Technical specs and design documentation
├── public/             # Assets (Audio, Images, Logos)
├── scripts/            # Python automation for data processing
└── src/
    ├── components/     # Custom Web Components (TextSection, VocabCard, etc.)
    ├── styles/         # Global design tokens and CSS
    ├── utils/          # Security (XSS Sanitizer) and Helpers
    └── web/            # Main App container and routing
```

---

## 🛠 Installation & Development

### 1. Setup
```bash
# Clone the repo
git clone https://github.com/heroyik/redgold.git

# Install dependencies
npm install
```

### 2. Local Development
```bash
# Start the dev server
npm run dev
```

### 3. Production Build
```bash
# Build for deployment
npm run build
```

---

## 🗺 Roadmap

| Phase | Milestone | Status |
| :--- | :--- | :--- |
| **UI/UX** | Landing Page Refresh (Book Covers + Hip Tagline) | ✅ Done |
| **Logic** | Forward-only Scroll Sync Engine | ✅ Done |
| **Pedagogy** | Proper Nouns with Pinyin + English Meaning | ✅ Done |
| **Versioning** | Pre-commit patch bump + versioned commit messages + header badge | ✅ Done |
| **Auth** | Firebase Authentication Implementation | ✅ Done |
| **Data** | Lesson 5 Textbook Data Build-Out | ✅ Done |
| **Data** | Mastery Quiz System & Progress Tracking | ⏳ Next |

---

## 📋 Changelog

Every local commit bumps the patch version by `0.0.1`, and the commit message is auto-stamped with that exact version. Here's the human-readable tea:

---

### v0.9.78 — 2026-06-02
> *Lesson 5 Complete.* The textbook data pipeline now covers Lesson 5.

- 📚 **Lesson 5 Textbook Data Complete** — Added `data/lesson5.json` for `王静在家具店买沙发`, covering Text 1-5, vocabulary, grammar notes, comparison content, same-character word notes, mastery sentences, and locale data.
- ✅ **Validation** — Confirmed `data/lesson5.json` parses as valid JSON.

---

### v0.9.75 — 2026-06-01
> *Lesson 4 Image Recognition Pass, Canonical Schema Rules & Fixed Lesson Header.* Today's work tightened the data pipeline and made lesson navigation stay put.

- 📌 **Always-Fixed Lesson Selector Header** — The top lesson chip bar (`Home`, `L1...`, language picker, pinyin toggle) now uses viewport-level fixed positioning, so it remains visible while scrolling anywhere inside a lesson page.
- 🧭 **Sticky Lesson Toolbar** — The lesson title and tab row are grouped into a dedicated sticky toolbar below the fixed lesson selector. This keeps the current lesson context and tab controls accessible without covering the content.
- 📚 **Lesson 4 Textbook Data Build-Out** — Expanded `data/lesson4.json` from the provided textbook images: 5 text sections, 36 vocabulary items, 6 grammar points, 5 mastery sentences, and complete text-line translations.
- 🌐 **Missing Translation Fixes** — Filled the previously missing translations for Lesson 4 text 1 line 0, text 4, and text 5. The translation map now covers all 20 Lesson 4 text lines with KO, JA, and EN entries.
- 🧩 **0-Based Text Translation Rule** — Updated localization rules so `translations.texts[{textId}].lines` must use JavaScript array indices (`0`, `1`, `2...`) instead of textbook-style line numbers. This prevents app-visible “missing translation” cases for one-line monologues.
- 🧱 **Canonical Lesson Schema Added** — Added `plan/lesson-schema-canonical.md` as the official schema reference based on the current `lesson1.json` structure, including `formal_examples[]`, `colloquial_examples[]`, `lessonTitle`, `textTitles`, and KO/JA/EN translation objects.
- 📸 **Image Recognition Pipeline v2 Docs** — Added `plan/image-recognition-spec.md` and `plan/image_recognition_status.md` to document the textbook-image-to-JSON workflow, current lesson progress, and schema expectations.
- 🛠️ **Rule Files Hardened** — Updated `1.rules_kewen.md`, `2.rules_notes.md`, `3.rules_mastery.md`, and `4.rules_locale.md` to reference the canonical schema, require complete locale data, preserve proper pinyin such as `ü`, and use array-based grammar examples.
- ✅ **Validation** — Ran `npm run build` successfully after the data and UI changes.

---

### v0.9.74 — 2026-06-01
> *生词-Sourced Vocab, Lesson Title i18n & Pinyin Toggle Polish.* Precision over assumptions.

- 📝 **Pinyin Toggle Fix for Text Titles** — Extracted pinyin from text titles (e.g., `孙月和王静聊王静的男朋友 (sūn yuè hé wáng jìng liáo wáng jìng de nán péng yǒu)`) into a separate `.pinyin` div via `titlePinyin` field in `lessonTranslations.ts`, so the global pinyin toggle CSS properly hides/shows it.
- 🎯 **Vocab & Review Tabs Now Sourced from 生词** — Both tabs now collect unique vocabulary items from each text's 生词 (new words) section instead of the top-level `lesson.vocabulary` array. This ensures only words actually introduced in the textbook pages appear.
- 🔧 **`getTextVocab()` Extracted** — Deduplicated vocab collection logic into a reusable exported function in `lessonTranslations.ts`, used by both the vocab tab and review tab.
- 🛡️ **Meaning Fallback Fix** — Added `pickLocalized(...) || item.meaning` so text vocabulary items without a translation pack entry still display their original English meaning (e.g., `幸福` → `adj. happy`).
- 🌏 **Lesson Title Korean/Japanese i18n** — Filled in `lessonTitle` and `textTitles` translations (ko/ja) for Lessons 1–4. Now the lesson header properly displays the locale-specific subtitle below the pinyin line.

---

### v0.9.49 — 2026-05-05
> *Firebase Authentication & User Profile.* Identity is now live.

- 🔐 **Firebase Authentication** — Implemented Google Sign-In with a custom `UserMenu` Web Component.
- 👤 **User Profile UI** — Added a sleek, glassmorphic profile menu to both the landing page and lesson view header, showing user name, email, and photo.
- 🛠 **Auth Utility** — Created a centralized `auth.ts` utility for handling user state and authentication logic.
- 🔢 **Version Bump** — Updated to v0.9.49 as part of the automated versioning workflow.

---

### v0.9.46 — 2026-05-03
> *Mobile-First UX Optimization & Cloud Sync.* The Review Tab gets a massive glow-up.

- ☁️ **Firestore Integration** — Migrated local `lesson1.json` data to Firebase Firestore, laying the groundwork for a true backend architecture.
- 📱 **Mobile UI/UX Polish** — Complete overhaul of the Review tab for modern, high-aspect-ratio screens (Galaxy S26 / iPhone Pro). Eliminated rogue left-margins and packed the top header icons perfectly into a single responsive row.
- 🔄 **Click-to-Flip Refined** — Resolved PC vs Mobile interaction conflicts. Cards now flip flawlessly on a simple click or tap through a centralized `InteractionManager`.
- 📐 **Perfect Card Boundaries** — Leveraged `dvh` calculations (`calc(100dvh - 380px)`) to aggressively subtract header real estate. Flashcard outlines now fit perfectly on-screen without clipping, and long texts (like complex meanings or examples) are neatly scrollable inside the card itself.
- 🎯 **Absolute Center Alignment** — Chinese characters on the front face are perfectly centered vertically and horizontally. Fixed descender drifts by applying `line-height: 1` alongside precise flexbox layouts.
- 🎧 **Visual Audio Triggers** — Replaced text-based audio buttons with sleek, static PNG icons for better intuition.
- 📝 **App Manifesto Update** — Rewrote the intro messaging to sound more colloquial and explicitly highlight the "HSK4 learners" target audience, while strictly preserving the GitHub footer link.
- ⬅️ **Navigation Enhancements** — Added tactile left/right arrows flanking the progress counter (`< 1/31 >`) for immediate visual navigation cues.
- 🧹 **Layout Compaction** — Reduced unnecessary padding between the version badge and the logo to grant more breathing room to core content.

---

### v0.9.0 — 2026-05-01
> *The version system drops.* Things just got official.

- 🔢 **Version badge is live** — header now shows `vX.X.X` + last build date on both the landing page and the lesson view
- ⚙️ **Automatic patch bump** — local git hooks patch `0.0.1` before every commit and make sure the commit message includes the bumped version
- 🏷️ **专有名词 (Proper Nouns) overhaul** — corrected all proper noun entries to match the actual textbook pages (images > assumptions, always)
- 📖 **Dialogue 2 data fix** — `李` is the only proper noun. `王静` and `李老师` were wrongly listed; axed. Textbook is the source of truth.
- ➕ **幸福 (xìngfú)** added to Dialogue 2 vocabulary — it was literally in the textbook and we missed it. Fixed.
- 📏 **Vocabulary meanings tightened up** — part-of-speech labels (`adj.`, `v.`, `adv.`) now match the textbook format exactly

---

## 🤝 Reference & Credits

Redgold is an educational tool designed to complement the **[HSK Standard Course 4](https://www.blcup.com/EnSeriesBook/index/8)** textbook series authorized by **Hanban** and published by **BLCUP**.

<p align="center">
  Built with ❤️ by the RedGold Team.<br>
  <strong>Speak the Language, Not Just the Grammar.</strong>
</p>
