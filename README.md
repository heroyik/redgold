<p align="center">
  <img src="public/assets/logo.png" width="240" alt="Redgold Logo">
</p>

<h1 align="center">✨ REDGOLD (赤金汉语) ✨</h1>

<p align="center">
  <strong>HSK 4 Standard Course: Reimagined for the Modern Learner.</strong><br>
  <em>The perfect fusion of academic precision and colloquial soul.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Stack-Vite_%7C_TS_%7C_WebComponents-ff9e4d?style=for-the-badge" alt="Stack">
  <img src="https://img.shields.io/badge/Design-Modern_Han_Elegant-gold?style=for-the-badge" alt="Design">
  <img src="https://img.shields.io/badge/Mobile-Galaxy_S26_Optimized-8B0000?style=for-the-badge" alt="Mobile">
</p>

---

## 🏮 The Philosophy: Red Meets Gold

In Chinese learning, there has always been a wall. On one side, the **Red**—the formal, structured HSK curriculum. On the other side, the **Gold**—the colloquial, native rhythm of real life.

**Redgold** bridges this gap. We transform the HSK 4 Standard Course into a premium, interactive experience that teaches you not just *what* to say, but *how* to say it like a native.

---

## 🚀 Key Features

### 📖 Immersive Landing Page
Experience a premium entry point featuring the official **HSK 4 Standard Course** (Upper/Lower) textbook covers. Start your journey with a beautiful, visual chapter selection grid.

### 🎧 Synchronized Audio Highlighting
Learn by listening with our intelligent synchronization engine. As the audio plays, the text highlights and scrolls automatically, keeping the current sentence perfectly centered for focus.

### ⚡ Dual-Track Learning
- **Red (Formal)**: Master the exact patterns required for the HSK 4 exam.
- **Gold (Colloquial)**: Discover how native speakers *actually* use those patterns in daily life.

### 🎨 Modern Han Elegant UI
A "glassmorphic" interface designed with high-end aesthetics:
- Subtle gradients and backdrop blurs.
- Responsive design tailored for modern high-aspect-ratio displays (Galaxy S26).
- Smooth animations and micro-interactions.

### 📚 Full Curriculum Coverage
Support for all **20 Lessons** of the HSK 4 Standard Course, including vocabulary, grammar points, texts, and key sentences.

---

## 🛠 Tech Stack

Built with a focus on performance, scalability, and the Google Cloud ecosystem:

- **Frontend Core**: [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Architecture**: Vanilla Web Components (Fast, Lightweight, Dependency-free)
- **Styling**: Custom CSS Design System (Redgold Tokens)
- **Backend**: [Firebase](https://firebase.google.com/) (Hosting, Authentication & Firestore)
- **CI/CD**: GitHub Actions for automated deployment to GitHub Pages.

---

## 🏗 Architecture Insights

### High-Performance Asset Engine
- **Lazy Loading**: Lesson data is dynamically imported only when needed, reducing initial bundle size and improving Time-to-Interactive.
- **Proactive Prefetching**: An intelligent engine that predicts user navigation and pre-warms audio and JSON assets via hover triggers and scroll proximity.
- **Hardware Acceleration**: CSS `will-change` and `content-visibility: auto` properties ensure 60fps animations and smooth scrolling through long lesson content.

### Security-First Design
- **XSS Protection**: All dynamic content is sanitized through a custom `sanitizeHTML` utility before being injected into the DOM.
- **Strict Content Security Policy (CSP)**: Hardened headers to prevent unauthorized script execution and cross-site scripting.

### Intelligent Scroll Engine

Our `TextSection` component uses a character-weight heuristic to synchronize audio with text. It calculates precisely when to scroll and highlight each line based on audio duration and text complexity, ensuring a seamless "Karaoke-style" reading experience.

### Mobile Optimization
Special attention has been given to modern mobile ergonomics, including:
- **Safe-area handling** for notch displays.
- **Sticky Tab Navigation** for easy switching between Vocab, Grammar, and Texts.
- **Horizontal Lesson Scroller** for quick chapter switching.

---

## 🛠 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/heroyik/redgold.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Launch the Dev Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🤝 Reference & Acknowledgement

Redgold is an educational tool designed to complement the **HSK Standard Course 4** textbook series authorized by **Hanban** and published by **Beijing Language and Culture University Press (BLCUP)**. We encourage all users to purchase the original textbooks to support the creators of this excellent curriculum.

---

<p align="center">
  Built with ❤️ for the global Chinese learning community.<br>
  <strong>Redgold: Speak the Language, Not Just the Grammar.</strong>
</p>
