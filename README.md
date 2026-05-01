<p align="center">
  <img src="public/assets/logo.png" width="240" alt="Redgold Logo">
</p>

<h1 align="center">✨ REDGOLD ✨</h1>

<p align="center">
  <strong>Textbooks are mid. Master the bridge from HSK 4 to real-world talk.</strong><br>
  <em>The perfect fusion of academic precision and colloquial soul.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Stack-Vite_%7C_TS_%7C_WebComponents-ff9e4d?style=for-the-badge" alt="Stack">
  <img src="https://img.shields.io/badge/Design-Modern_Han_Elegant-gold?style=for-the-badge" alt="Design">
  <img src="https://img.shields.io/badge/Pedagogy-Colloquial_Bridge-8B0000?style=for-the-badge" alt="Pedagogy">
</p>

---

## 🏮 The Philosophy: Red Meets Gold

In traditional Chinese learning, there has always been a disconnect. 
- **The Red (赤)**: Represents the formal, structured HSK curriculum—essential for exams but often sounding "robotic" in real life.
- **The Gold (金)**: Represents the colloquial, native rhythm—the way people *actually* talk in the streets of Beijing or Shanghai.

**RedGold** bridges this gap. We transform the **HSK 4 Standard Course** into a premium, interactive experience that teaches you not just *what* to say, but *how* to say it like a native.

---

## 🚀 Core Features

### 🎬 Karaoke-Style Scroll Sync
Our intelligent **Scroll Engine** in the `TextSection` component provides a seamless reading experience. 
- **Forward-Only Logic**: The viewport only moves forward with the audio, preventing distracting "snaps" back to previous lines.
- **Timing Heuristics**: Calculates line changes based on character weight and audio duration for frame-perfect synchronization.

### 🏷️ Proper Nouns Support
Unlike standard HSK tools, RedGold explicitly identifies and styles **Proper Nouns** (names, places, brands). This prevents confusion between new vocabulary and unique identifiers, styled in a dedicated **Modern Han Elegant** gold theme.

### ⚡ Smart Prefetching
Zero-latency transitions. The app predicts your learning path and pre-warms audio assets and lesson data as you browse, ensuring the next chapter is ready before you even click.

### 🎨 Modern Han Elegant UI
A premium "glassmorphic" interface designed for focus:
- **Responsive Layout**: Tailored for high-aspect-ratio mobile displays (Galaxy S26/iPhone Pro Max).
- **Sticky Navigation**: Smooth tab switching between Vocab, Grammar, and Texts.
- **Visual Selection**: Browse lessons via high-resolution 3D-styled textbook covers.

---

## 🛠 Tech Stack & Architecture

Built for performance, scalability, and the **Google Cloud** ecosystem:

- **Frontend**: [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Architecture**: **Vanilla Web Components** (Shadow DOM, 0-dependency runtime)
- **Styling**: Vanilla CSS with a centralized token system (Modern Han Elegant)
- **Backend**: [Firebase](https://firebase.google.com/) (Hosting, Auth, Firestore ready)
- **CI/CD**: GitHub Actions for automated deployment to GitHub Pages.

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
| **Pedagogy** | Proper Nouns Integration | ✅ Done |
| **Auth** | Firebase Authentication Implementation | ⏳ Next |
| **Data** | Mastery Quiz System & Progress Tracking | ⏳ Planned |

---

## 🤝 Reference & Credits

Redgold is an educational tool designed to complement the **HSK Standard Course 4** textbook series authorized by **Hanban** and published by **BLCUP**. 

<p align="center">
  Built with ❤️ by the RedGold Team.<br>
  <strong>Speak the Language, Not Just the Grammar.</strong>
</p>


