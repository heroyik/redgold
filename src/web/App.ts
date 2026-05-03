import '../components/VocabCard';
import '../components/GrammarCard';
import '../components/TextSection';
import '../components/KeySentences';
import '../components/SourceInfo';
import { translateLessonData, type AppLanguage } from '../utils/lessonTranslations';
import { getUiCopy } from '../utils/uiCopy';
import { testFirebase } from '../test-ts';

// 앱 시작 시 테스트 실행
testFirebase();

type LessonData = {
  lessonId?: number;
  title: string;
  vocabulary: any[];
  grammar: any[];
  texts: any[];
  key_sentences?: any[];
};

const lessonModules = import.meta.glob('../../data/lesson*.json', {
  eager: false,
  import: 'default',
}) as Record<string, () => Promise<LessonData>>;

class App extends HTMLElement {
  private _data: LessonData | null = null;
  private _activeTab: string = 'vocab';
  private _currentLesson: number = 1;
  private _viewMode: 'landing' | 'lesson' = 'landing';
  private _language: AppLanguage = 'en';
  private _prefetchedLessons = new Map<number, LessonData>();
  private _prefetchedAudio = new Set<string>();
  
  private _lessons = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Lesson ${i + 1}: ${this._getLessonTitle(i + 1)}`
  }));

  private _getLessonTitle(id: number): string {
    const titles: Record<number, string> = {
      1: '简单的爱情', 2: '真正的朋友', 3: '经理对我印象很好', 4: '不要太着急赚钱', 5: '只买对的，不买贵的',
      6: '一分钱一分货', 7: '最好的医生是自己', 8: '生活中不缺少美', 9: '阳光总在风雨后', 10: '幸福的标准',
      11: '读书好，读好书，好读书', 12: '用心发现世界', 13: '喝着茶看中国', 14: '保护地球母亲', 15: '教育孩子的艺术',
      16: '生活可以更美好', 17: '人与自然', 18: '科技与生活', 19: '生活的味道', 20: '路上的风景'
    };
    return titles[id] || `HSK 4 Chapter ${id}`;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._language = this.getSavedLanguage();
  }

  getSavedLanguage(): AppLanguage {
    const saved = window.localStorage.getItem('redgold-language');
    if (saved === 'ko' || saved === 'ja' || saved === 'en') return saved;

    const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
    const normalized = locales
      .filter((locale): locale is string => Boolean(locale))
      .map(locale => locale.toLowerCase());

    if (normalized.some(locale => locale.startsWith('ko'))) return 'ko';
    if (normalized.some(locale => locale.startsWith('ja'))) return 'ja';
    return 'en';
  }

  setLanguage(language: AppLanguage) {
    this._language = language;
    window.localStorage.setItem('redgold-language', language);
    this.render();
  }

  getLandingCopy() {
    const copy: Record<AppLanguage, string> = {
      en: `<strong>Red</strong> = textbook-mode, clean and correct.<br><strong>Gold</strong> = the real-life vibe, the way people actually talk.<br>Put them together and you get <strong>RedGold</strong>: less robotic, more native, way more fun.`,
      ko: `<strong>Red</strong>는 교과서식 중국어예요. 정확하고 반듯하죠.<br><strong>Gold</strong>는 진짜 사람들이 일상에서 툭툭 쓰는 살아 있는 말이고요.<br>그래서 <strong>RedGold</strong>는 둘 다 가져갑니다. 교과서의 정확함은 챙기고, 현지 말맛은 제대로 살리고.`,
      ja: `<strong>Red</strong> = 教科書モード、きれいで正確な中国語。<br><strong>Gold</strong> = 実戦のノリ、ネイティブが本当に使う言い回し。<br>この二つを合わせたのが <strong>RedGold</strong>。固すぎず、ちゃんと自然で、勉強もちょっと楽しくなる。`
    };

    return copy[this._language];
  }

  connectedCallback() {
    this.render();
    // Warm up the first lesson
    this.prefetchLesson(1);
  }

  async fetchData() {
    if (this._viewMode === 'landing') return;
    const ui = getUiCopy(this._language);

    this._data = null;
    this.render();
    
    try {
      if (this._prefetchedLessons.has(this._currentLesson)) {
        this._data = this._prefetchedLessons.get(this._currentLesson)!;
      } else {
        const path = `../../data/lesson${this._currentLesson}.json`;
        const loader = lessonModules[path];
        if (!loader) throw new Error(`Lesson ${this._currentLesson} loader not found`);
        const lesson = await loader();
        this._data = {
          title: lesson.title,
          vocabulary: lesson.vocabulary || [],
          grammar: lesson.grammar || [],
          texts: lesson.texts || [],
          key_sentences: lesson.key_sentences || [],
        };
        this._prefetchedLessons.set(this._currentLesson, this._data);
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
      this._data = {
        title: `${ui.chapter} ${this._currentLesson}: ${ui.comingSoon}`,
        vocabulary: [],
        grammar: [],
        texts: [],
        key_sentences: [],
      };
    }
    this.render();
  }

  async prefetchLesson(id: number) {
    if (this._prefetchedLessons.has(id)) return;

    try {
      const path = `../../data/lesson${id}.json`;
      const loader = lessonModules[path];
      if (loader) {
        const data = await loader();
        this._prefetchedLessons.set(id, data);
        
        // Prefetch audio files for this lesson
        if (data.texts) {
          data.texts.forEach((text: any) => {
            if (text.audio && !this._prefetchedAudio.has(text.audio)) {
              const audio = new Audio();
              audio.src = text.audio;
              audio.preload = 'auto';
              this._prefetchedAudio.add(text.audio);
              console.log(`[Prefetch] Audio: ${text.audio}`);
            }
          });
        }
      }
    } catch (e) {
      console.warn(`[Prefetch] Failed for lesson ${id}`, e);
    }
  }

  async selectLesson(id: number) {
    this._currentLesson = id;
    this._viewMode = 'lesson';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await this.fetchData();
    // Proactive: Prefetch next lesson
    if (id < 20) {
      setTimeout(() => this.prefetchLesson(id + 1), 2000); // Wait a bit to not compete with current load
    }
  }

  switchTab(tab: string) {
    this._activeTab = tab;
    this.render();
  }

  goHome() {
    this._viewMode = 'landing';
    this._data = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    if (this._viewMode === 'landing') {
      this.renderLanding();
    } else {
      this.renderLesson();
    }
    
    this.setupEventListeners();
    this.updated();
  }

  renderLanding() {
    if (!this.shadowRoot) return;
    const ui = getUiCopy(this._language);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
          font-family: 'Outfit', 'Noto Sans SC', sans-serif;
          color: #1a1a1a;
          background: #FDFBF7;
        }
        
        .landing-container {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-title {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .hero-wordmark {
          width: min(82vw, 520px);
          height: auto;
          display: block;
          margin: 0 0 0.45rem;
          filter: drop-shadow(0 18px 28px rgba(139, 0, 0, 0.08));
          /* Ensure vertical centering if needed, though hero is usually okay */
        }

        .version-badge {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #B8860B;
          opacity: 0.75;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          font-family: 'Outfit', monospace;
        }

        .hero-title p {
          font-size: 1.1rem;
          color: #666;
          font-weight: 500;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.4;
        }

        .book-section-label {
          text-align: center;
          font-weight: 800;
          color: #8B0000;
          margin: 3rem 0 1.5rem;
          font-size: 0.75rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          opacity: 0.5;
        }

        .landing-hero {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          text-align: center;
          background: radial-gradient(circle at top right, rgba(218, 165, 32, 0.1), transparent),
                      radial-gradient(circle at bottom left, rgba(139, 0, 0, 0.05), transparent);
        }

        .landing-books {
          display: flex;
          gap: 1rem;
          margin: 3rem 0;
          perspective: 1000px;
        }

        .language-picker {
          display: inline-flex;
          gap: 0.5rem;
          padding: 0.45rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(139, 0, 0, 0.08);
          box-shadow: 0 8px 24px rgba(0,0,0,0.05);
          margin-top: 1.5rem;
        }

        .language-btn {
          border: none;
          background: transparent;
          color: #7a7a7a;
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0.65rem 1rem;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .language-btn.active {
          background: #8B0000;
          color: #fff;
          box-shadow: 0 8px 18px rgba(139, 0, 0, 0.18);
        }

        .book-preview {
          width: clamp(100px, 30vw, 150px);
          height: auto;
          border-radius: 8px;
          box-shadow: 10px 10px 30px rgba(0,0,0,0.15);
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
        }

        .book-preview:hover {
          transform: rotateY(-15deg) scale(1.05);
        }

        .start-btn {
          padding: 1.25rem 3rem;
          background: #8B0000;
          color: white;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(139, 0, 0, 0.2);
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .start-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(139, 0, 0, 0.3);
          background: #a00000;
        }

        @media (max-width: 480px) {
          .landing-hero {
            justify-content: flex-start;
            padding: calc(var(--safe-top, 0px) + 1rem) 1rem 1.5rem;
          }

          .hero-wordmark {
            width: min(78vw, 420px);
            margin-bottom: 0.2rem;
          }

          .version-badge {
            margin-bottom: 0.55rem;
          }

          .hero-title p {
            font-size: 0.98rem;
            line-height: 1.32;
            max-width: 23rem;
          }

          .language-picker {
            margin-top: 1rem;
          }

          .language-btn {
            padding: 0.6rem 0.9rem;
            font-size: 0.78rem;
          }

          .start-btn {
            margin-top: 1rem;
            padding: 1rem 2.2rem;
            font-size: 1rem;
            letter-spacing: 1px;
          }

          .landing-books {
            gap: 0.8rem;
            margin: 1.25rem 0 0;
          }

          .book-preview {
            width: clamp(96px, 28vw, 128px);
          }
        }

        .chapter-selection {
          padding: 2rem 1rem 6rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .chapter-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 3rem;
        }

        .chapter-card {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          border: 1px solid rgba(139, 0, 0, 0.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          transition: all 0.3s;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .chapter-card:hover {
          transform: translateY(-5px);
          border-color: #DAA520;
          box-shadow: 0 15px 30px rgba(0,0,0,0.06);
        }

        .chapter-num {
          font-size: 0.7rem;
          font-weight: 800;
          color: #DAA520;
          text-transform: uppercase;
        }

        .chapter-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #1a1a1a;
          line-height: 1.3;
        }

        .landing-footer {
          padding: 4rem 1.25rem;
          text-align: center;
          opacity: 0.4;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .landing-footer a {
          color: inherit;
          text-decoration: none;
          transition: opacity 0.3s, transform 0.3s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .landing-footer a:hover {
          opacity: 1;
          transform: translateY(-1px);
        }
      </style>
      
      <div class="landing-container">
        <section class="landing-hero">
          <div class="hero-title">
            <img src="assets/redgold-wordmark-fixed.png?v=${__APP_VERSION__}" alt="RedGold" class="hero-wordmark">
            <div class="version-badge">v${__APP_VERSION__} &nbsp;·&nbsp; ${__APP_BUILD_DATE__}</div>
            <p>${this.getLandingCopy()}</p>
          </div>

          <div class="language-picker" id="language-picker">
            <button class="language-btn ${this._language === 'en' ? 'active' : ''}" data-lang="en">English</button>
            <button class="language-btn ${this._language === 'ko' ? 'active' : ''}" data-lang="ko">한국어</button>
            <button class="language-btn ${this._language === 'ja' ? 'active' : ''}" data-lang="ja">日本語</button>
          </div>

          <button class="start-btn" id="start-learning-btn">${ui.exploreLessons}</button>
          
          <div class="landing-books">
            <img src="images/hsk4_upper.jpg" class="book-preview" alt="HSK 4 Upper" id="book-upper" decoding="async">
            <img src="images/hsk4_lower.jpg" class="book-preview" alt="HSK 4 Lower" id="book-lower" decoding="async">
          </div>
        </section>
 
        <section class="chapter-selection" id="selection-area">
          <div class="book-section-label">${ui.volume1}</div>
          <div class="chapter-grid">
            ${this._lessons.slice(0, 10).map(l => `
              <div class="chapter-card" data-id="${l.id}">
                <span class="chapter-num">${ui.chapter} ${l.id}</span>
                <span class="chapter-name">${l.title.split(':')[1]?.trim()}</span>
              </div>
            `).join('')}
          </div>
 
          <div class="book-section-label">${ui.volume2}</div>
          <div class="chapter-grid">
            ${this._lessons.slice(10, 20).map(l => `
              <div class="chapter-card" data-id="${l.id}">
                <span class="chapter-num">${ui.chapter} ${l.id}</span>
                <span class="chapter-name">${l.title.split(':')[1]?.trim()}</span>
              </div>
            `).join('')}
          </div>
        </section>
        
        <footer class="landing-footer">
          <div>${ui.footerTagline}</div>
          <a href="https://github.com/heroyik/redgold" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GITHUB
          </a>
        </footer>
      </div>

    `;
  }

  renderLesson() {
    if (!this.shadowRoot) return;

    const content = this.renderContent();
    const ui = getUiCopy(this._language);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
          font-family: 'Outfit', 'Noto Sans SC', sans-serif;
          color: #1a1a1a;
          overflow-x: hidden;
          background: #FDFBF7;
        }

        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(253, 251, 247, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(139, 0, 0, 0.05);
          padding: calc(var(--safe-top, 0px) + 0.5rem) 0 0.5rem;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem 0.5rem;
        }

        .home-link {
          font-weight: 900;
          color: #8B0000;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: transform 0.3s;
        }

        .home-link:active { transform: scale(0.95); }
        
        .home-icon {
          height: 1.55rem;
          width: auto;
          display: block;
        }

        .header-wordmark {
          height: 1.55rem;
          width: auto;
          display: block;
        }

        .header-version {
          font-size: 0.55rem;
          font-weight: 700;
          color: #B8860B;
          background: rgba(184, 134, 11, 0.1);
          border: 1px solid rgba(184, 134, 11, 0.3);
          border-radius: 4px;
          padding: 1px 5px;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          height: fit-content;
        }

        .header-date {
          font-size: 0.55rem;
          font-weight: 700;
          opacity: 0.35;
          letter-spacing: 1px;
          color: #333;
          text-transform: uppercase;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .mini-language-picker {
          display: inline-flex;
          gap: 0.25rem;
          padding: 0.2rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(139, 0, 0, 0.08);
        }

        .mini-language-btn {
          border: none;
          background: transparent;
          color: #777;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.3px;
          padding: 0.35rem 0.55rem;
          border-radius: 999px;
          cursor: pointer;
        }

        .mini-language-btn.active {
          background: #8B0000;
          color: #fff;
        }

        .lesson-scroller {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 0.5rem 1.25rem 0.75rem;
          gap: 0.6rem;
          scrollbar-width: none;
        }

        .lesson-scroller::-webkit-scrollbar { display: none; }

        .lesson-chip {
          flex: 0 0 auto;
          padding: 0.5rem 1.2rem;
          border-radius: 50px;
          background: #fff;
          border: 1px solid rgba(139, 0, 0, 0.08);
          color: #666;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }

        .lesson-chip.active {
          background: #8B0000;
          color: #fff;
          border-color: #8B0000;
          box-shadow: 0 4px 12px rgba(139, 0, 0, 0.2);
        }

        .app-container {
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
          padding: 1rem;
        }

        header {
          text-align: center;
          margin: 1rem 0 2rem;
        }

        h1 {
          font-size: clamp(1.4rem, 5vw, 2.2rem);
          margin: 0;
          color: #8B0000;
          font-weight: 900;
          line-height: 1.2;
        }

        .subtitle {
          color: #666;
          font-size: 0.85rem;
          margin-top: 0.4rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        nav {
          display: flex;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(139, 0, 0, 0.1);
          border-radius: 24px;
          padding: 0.25rem;
          margin-bottom: 1.5rem;
          position: sticky;
          top: 6.5rem; 
          z-index: 900;
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }

        .tab-btn {
          flex: 1;
          border: none;
          background: none;
          padding: 0.8rem 0.5rem;
          border-radius: 18px;
          font-size: 0.8rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tab-btn.active {
          background: #fff;
          color: #8B0000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(139, 0, 0, 0.1);
          border-left-color: #8B0000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        footer {
          margin-top: 4rem;
          text-align: center;
          padding: 3rem 1.25rem;
          border-top: 1px solid rgba(0,0,0,0.03);
        }

        .footer-logo {
          color: #8B0000;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 2px;
          opacity: 0.3;
        }
      </style>
      
      <div class="app-shell">
        <div class="sticky-header">
          <div class="header-top">
            <div class="home-link" id="home-link">
              <img src="assets/home-icon.png" alt="Home" class="home-icon">
              <img src="assets/redgold-wordmark-fixed.png?v=${__APP_VERSION__}" alt="RedGold" class="header-wordmark">
              <span class="header-version">v${__APP_VERSION__}</span>
            </div>
            <div class="header-controls">
              <div class="mini-language-picker">
                <button class="mini-language-btn ${this._language === 'en' ? 'active' : ''}" data-lang="en">EN</button>
                <button class="mini-language-btn ${this._language === 'ko' ? 'active' : ''}" data-lang="ko">KO</button>
                <button class="mini-language-btn ${this._language === 'ja' ? 'active' : ''}" data-lang="ja">JP</button>
              </div>
              <div class="header-date">${__APP_BUILD_DATE__}</div>
            </div>
          </div>
          <div class="lesson-scroller">
            ${this._lessons.map(l => `
              <div class="lesson-chip ${this._currentLesson === l.id ? 'active' : ''}" data-id="${l.id}">
                L${l.id} • ${l.title.split(':')[1]?.trim() || l.title}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="app-container">
          <header>
            <h1>${this._data ? this._data.title.split('(')[0].trim() : 'HSK 4'}</h1>
            <p class="subtitle">${this._data ? this._data.title.split('(')[1]?.replace(')', '') || ui.loading : ui.loading}</p>
          </header>

          <nav>
            <button class="tab-btn ${this._activeTab === 'vocab' ? 'active' : ''}" id="tab-vocab">${ui.tabVocab}</button>
            <button class="tab-btn ${this._activeTab === 'grammar' ? 'active' : ''}" id="tab-grammar">${ui.tabGrammar}</button>
            <button class="tab-btn ${this._activeTab === 'text' ? 'active' : ''}" id="tab-text">${ui.tabTexts}</button>
            <button class="tab-btn ${this._activeTab === 'mastery' ? 'active' : ''}" id="tab-mastery">${ui.tabMastery}</button>
          </nav>

          <main>
            ${this._data ? content : `
              <div class="loading-container">
                <div class="loading-spinner"></div>
              </div>
            `}
          </main>

          <source-info></source-info>

          <footer>
            <div class="footer-logo">${ui.footerBrand}</div>
            <a href="https://github.com/heroyik/redgold" target="_blank" rel="noopener noreferrer" style="margin-top: 1rem; display: inline-flex; align-items: center; gap: 6px; color: inherit; text-decoration: none; opacity: 0.3; font-size: 0.65rem; font-weight: 800; letter-spacing: 2px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GITHUB
            </a>
          </footer>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const root = this.shadowRoot;
    if (!root) return;

    if (this._viewMode === 'landing') {
      root.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', () => {
          const language = (button as HTMLElement).dataset.lang as AppLanguage | undefined;
          if (language) this.setLanguage(language);
        });
      });
      root.getElementById('start-learning-btn')?.addEventListener('click', () => {
        root.getElementById('selection-area')?.scrollIntoView({ behavior: 'smooth' });
      });
      root.querySelectorAll('.chapter-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = parseInt((card as HTMLElement).dataset.id || '1');
          this.selectLesson(id);
        });
        // Performance: Prefetch on hover
        card.addEventListener('mouseenter', () => {
          const id = parseInt((card as HTMLElement).dataset.id || '1');
          this.prefetchLesson(id);
        }, { once: true });
      });
      root.getElementById('book-upper')?.addEventListener('click', () => {
        root.getElementById('selection-area')?.scrollIntoView({ behavior: 'smooth' });
      });
      root.getElementById('book-lower')?.addEventListener('click', () => {
        root.getElementById('selection-area')?.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      root.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', () => {
          const language = (button as HTMLElement).dataset.lang as AppLanguage | undefined;
          if (language) this.setLanguage(language);
        });
      });
      root.getElementById('home-link')?.addEventListener('click', () => this.goHome());
      root.getElementById('tab-vocab')?.addEventListener('click', () => this.switchTab('vocab'));
      root.getElementById('tab-grammar')?.addEventListener('click', () => this.switchTab('grammar'));
      root.getElementById('tab-text')?.addEventListener('click', () => this.switchTab('text'));
      root.getElementById('tab-mastery')?.addEventListener('click', () => this.switchTab('mastery'));
      
      root.querySelectorAll('.lesson-chip').forEach(item => {
        item.addEventListener('click', () => {
          const id = parseInt((item as HTMLElement).dataset.id || '1');
          this.selectLesson(id);
        });
        // Performance: Prefetch on hover in scroller
        item.addEventListener('mouseenter', () => {
          const id = parseInt((item as HTMLElement).dataset.id || '1');
          this.prefetchLesson(id);
        }, { once: true });
      });

      const activeChip = root.querySelector('.lesson-chip.active');
      if (activeChip) {
        activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }

  renderContent() {
    if (!this._data) return '';

    const localizedLesson = translateLessonData(this._currentLesson, this._data, this._language);

    switch (this._activeTab) {
      case 'vocab':
        return `<div class="vocab-list">${localizedLesson.vocabulary.map((v: any) => `<vocab-card id="v-${v.word}"></vocab-card>`).join('')}</div>`;
      case 'grammar':
        return `<div class="grammar-list">${localizedLesson.grammar.map((g: any) => `<grammar-card id="g-${g.point}"></grammar-card>`).join('')}</div>`;
      case 'text':
        return `<div class="text-list">${localizedLesson.texts.map((t: any) => `<text-section id="t-${t.id}"></text-section>`).join('')}</div>`;
      case 'mastery':
        return `<div class="mastery-section"><key-sentences id="mastery-sentences"></key-sentences></div>`;
      default:
        return '';
    }
  }

  updated() {
    if (!this._data || this._viewMode === 'landing') return;

    const lessonData = translateLessonData(this._currentLesson, this._data, this._language);

    if (this._activeTab === 'vocab') {
      lessonData.vocabulary.forEach((v: any) => {
        const el = this.shadowRoot?.getElementById(`v-${v.word}`) as any;
        if (el) {
          el.language = this._language;
          el.data = v;
        }
      });
    } else if (this._activeTab === 'grammar') {
      lessonData.grammar.forEach((g: any) => {
        const el = this.shadowRoot?.getElementById(`g-${g.point}`) as any;
        if (el) {
          el.language = this._language;
          el.data = g;
        }
      });
    } else if (this._activeTab === 'text') {
      lessonData.texts.forEach((t: any) => {
        const el = this.shadowRoot?.getElementById(`t-${t.id}`) as any;
        if (el) {
          el.language = this._language;
          el.data = t;
        }
      });
    } else if (this._activeTab === 'mastery') {
      const el = this.shadowRoot?.getElementById('mastery-sentences') as any;
      if (el) {
        el.language = this._language;
        el.sentences = lessonData.key_sentences;
      }
    }
  }
}

customElements.define('chn-vocab-app', App);
export default App;
