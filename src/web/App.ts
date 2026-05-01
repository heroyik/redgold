import '../components/VocabCard';
import '../components/GrammarCard';
import '../components/TextSection';
import '../components/KeySentences';
import '../components/SourceInfo';

type LessonData = {
  lessonId?: number;
  title: string;
  vocabulary: any[];
  grammar: any[];
  texts: any[];
  key_sentences?: any[];
};

const lessonModules = import.meta.glob('../../data/lesson*.json', {
  eager: true,
  import: 'default',
}) as Record<string, LessonData>;

const lessonDataMap = new Map<number, LessonData>(
  Object.entries(lessonModules).map(([path, data]) => {
    const match = path.match(/lesson(\d+)\.json$/);
    return [Number(match?.[1] || data.lessonId || 0), data];
  }),
);

class App extends HTMLElement {
  private _data: LessonData | null = null;
  private _activeTab: string = 'vocab';
  private _currentLesson: number = 1;
  private _viewMode: 'landing' | 'lesson' = 'landing';
  
  private _lessons = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Lesson ${i + 1}: ${this._getLessonTitle(i + 1)}`
  }));

  private _getLessonTitle(id: number): string {
    const titles: Record<number, string> = {
      1: '简单的爱情', 2: '真正的朋友', 3: '经理对我印象很好', 4: '不要太着急赚钱', 5: '只买对的，不买贵的',
      6: '一分钱一分货', 7: '最好的医生是自己', 8: '生活中不缺少美', 9: '阳光总在风雨후', 10: '幸福的标准',
      11: '读书好，读好书，好读书', 12: '用心发现世界', 13: '喝着茶看中国', 14: '保护地球母亲', 15: '教育孩子的艺术',
      16: '生活可以更美好', 17: '人与自然', 18: '科技与生活', 19: '生活的味道', 20: '路上的风景'
    };
    return titles[id] || `HSK 4 Chapter ${id}`;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  async fetchData() {
    if (this._viewMode === 'landing') return;

    this._data = null;
    this.render();
    
    try {
      const lesson = lessonDataMap.get(this._currentLesson);
      if (!lesson) throw new Error('Lesson not found');
      this._data = {
        title: lesson.title,
        vocabulary: lesson.vocabulary || [],
        grammar: lesson.grammar || [],
        texts: lesson.texts || [],
        key_sentences: lesson.key_sentences || [],
      };
    } catch (error) {
      console.error('Error fetching lesson data:', error);
      this._data = {
        title: `Lesson ${this._currentLesson}: Coming Soon`,
        vocabulary: [],
        grammar: [],
        texts: [],
        key_sentences: [],
      };
    }
    this.render();
  }

  async selectLesson(id: number) {
    this._currentLesson = id;
    this._viewMode = 'lesson';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await this.fetchData();
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

        .hero-title h1 {
          font-size: clamp(2.5rem, 10vw, 4rem);
          margin-bottom: 0.5rem;
          letter-spacing: -2px;
          color: #8B0000;
          font-weight: 900;
        }

        .hero-title p {
          font-size: 1.1rem;
          color: #666;
          font-weight: 500;
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
          min-height: 90vh;
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
      </style>
      
      <div class="landing-container">
        <section class="landing-hero">
          <div class="hero-title">
            <h1>RedGold</h1>
            <p>Master HSK 4 Standard Course</p>
          </div>
          
          <div class="landing-books">
            <img src="images/hsk4_upper.jpg" class="book-preview" alt="HSK 4 Upper" id="book-upper">
            <img src="images/hsk4_lower.jpg" class="book-preview" alt="HSK 4 Lower" id="book-lower">
          </div>
          
          <button class="start-btn" id="start-learning-btn">Explore Lessons</button>
        </section>

        <section class="chapter-selection" id="selection-area">
          <div class="book-section-label">VOLUME 1 (上)</div>
          <div class="chapter-grid">
            ${this._lessons.slice(0, 10).map(l => `
              <div class="chapter-card" data-id="${l.id}">
                <span class="chapter-num">Chapter ${l.id}</span>
                <span class="chapter-name">${l.title.split(':')[1]?.trim()}</span>
              </div>
            `).join('')}
          </div>

          <div class="book-section-label">VOLUME 2 (下)</div>
          <div class="chapter-grid">
            ${this._lessons.slice(10, 20).map(l => `
              <div class="chapter-card" data-id="${l.id}">
                <span class="chapter-num">Chapter ${l.id}</span>
                <span class="chapter-name">${l.title.split(':')[1]?.trim()}</span>
              </div>
            `).join('')}
          </div>
        </section>
        
        <footer style="padding: 4rem 1rem; text-align: center; opacity: 0.3; font-size: 0.65rem; font-weight: 800; letter-spacing: 2px;">
          MODERN HAN ELEGANT • BLCUP OFFICIAL CURRICULUM
        </footer>
      </div>
    `;
  }

  renderLesson() {
    if (!this.shadowRoot) return;

    const content = this.renderContent();

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
          gap: 8px;
          transition: transform 0.3s;
        }

        .home-link:active { transform: scale(0.95); }

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>RedGold</span>
            </div>
            <div style="font-size: 0.65rem; font-weight: 900; opacity: 0.4; letter-spacing: 1px;">LEVEL 4</div>
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
            <p class="subtitle">${this._data ? this._data.title.split('(')[1]?.replace(')', '') || 'LOADING...' : 'LOADING...'}</p>
          </header>

          <nav>
            <button class="tab-btn ${this._activeTab === 'vocab' ? 'active' : ''}" id="tab-vocab">Vocab</button>
            <button class="tab-btn ${this._activeTab === 'grammar' ? 'active' : ''}" id="tab-grammar">Grammar</button>
            <button class="tab-btn ${this._activeTab === 'text' ? 'active' : ''}" id="tab-text">Texts</button>
            <button class="tab-btn ${this._activeTab === 'mastery' ? 'active' : ''}" id="tab-mastery">Mastery</button>
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
            <div class="footer-logo">MODERN HAN ELEGANT</div>
          </footer>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const root = this.shadowRoot;
    if (!root) return;

    if (this._viewMode === 'landing') {
      root.getElementById('start-learning-btn')?.addEventListener('click', () => {
        root.getElementById('selection-area')?.scrollIntoView({ behavior: 'smooth' });
      });
      root.querySelectorAll('.chapter-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = parseInt((card as HTMLElement).dataset.id || '1');
          this.selectLesson(id);
        });
      });
      root.getElementById('book-upper')?.addEventListener('click', () => {
        root.getElementById('selection-area')?.scrollIntoView({ behavior: 'smooth' });
      });
      root.getElementById('book-lower')?.addEventListener('click', () => {
        root.getElementById('selection-area')?.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
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
      });

      const activeChip = root.querySelector('.lesson-chip.active');
      if (activeChip) {
        activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }

  renderContent() {
    if (!this._data) return '';

    switch (this._activeTab) {
      case 'vocab':
        return `<div class="vocab-list">${this._data.vocabulary.map((v: any) => `<vocab-card id="v-${v.word}"></vocab-card>`).join('')}</div>`;
      case 'grammar':
        return `<div class="grammar-list">${this._data.grammar.map((g: any) => `<grammar-card id="g-${g.point}"></grammar-card>`).join('')}</div>`;
      case 'text':
        return `<div class="text-list">${this._data.texts.map((t: any) => `<text-section id="t-${t.id}"></text-section>`).join('')}</div>`;
      case 'mastery':
        return `<div class="mastery-section"><key-sentences id="mastery-sentences"></key-sentences></div>`;
      default:
        return '';
    }
  }

  updated() {
    if (!this._data || this._viewMode === 'landing') return;

    if (this._activeTab === 'vocab') {
      this._data.vocabulary.forEach((v: any) => {
        const el = this.shadowRoot?.getElementById(`v-${v.word}`) as any;
        if (el) el.data = v;
      });
    } else if (this._activeTab === 'grammar') {
      this._data.grammar.forEach((g: any) => {
        const el = this.shadowRoot?.getElementById(`g-${g.point}`) as any;
        if (el) el.data = g;
      });
    } else if (this._activeTab === 'text') {
      this._data.texts.forEach((t: any) => {
        const el = this.shadowRoot?.getElementById(`t-${t.id}`) as any;
        if (el) el.data = t;
      });
    } else if (this._activeTab === 'mastery') {
      const el = this.shadowRoot?.getElementById('mastery-sentences') as any;
      if (el) el.sentences = this._data.key_sentences;
    }
  }
}

customElements.define('chn-vocab-app', App);
export default App;
