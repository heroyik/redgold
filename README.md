<p align="center">
  <img src="public/assets/logo.png" width="240" alt="Redgold Logo">
</p>

<h1 align="center">✨ REDGOLD ✨</h1>

<p align="center">
  <strong>Textbooks are mid. Master the bridge from HSK 4 to real-world talk.</strong><br>
  <em>The perfect fusion of academic precision and colloquial soul.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.9.0-B8860B?style=for-the-badge" alt="Version">
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
| **Auth** | Firebase Authentication Implementation | ⏳ Next |
| **Data** | Mastery Quiz System & Progress Tracking | ⏳ Planned |

---

## 📋 Changelog

Every local commit bumps the patch version by `0.0.1`, and the commit message is auto-stamped with that exact version. Here's the human-readable tea:

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
