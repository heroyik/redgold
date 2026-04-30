import '../components/VocabCard';
import '../components/GrammarCard';
import '../components/TextSection';
import '../components/KeySentences';

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
  private _isSidebarOpen: boolean = false;
  private _currentLesson: number = 1;
  private _lessons = [
    { id: 1, title: 'Lesson 1: 简单的爱情' },
    { id: 2, title: 'Lesson 2: 真正的朋友' },
    { id: 3, title: 'Lesson 3: 经理对我印象很好' },
    { id: 4, title: 'Lesson 4: 不要太着急赚钱' },
    { id: 5, title: 'Lesson 5: 只买对的，不买贵的' }
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    await this.fetchData();
    this.render();
  }

  async fetchData() {
    this._data = null; // Show loading state
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

  toggleSidebar() {
    this._isSidebarOpen = !this._isSidebarOpen;
    this.render();
  }

  async selectLesson(id: number) {
    this._currentLesson = id;
    this._isSidebarOpen = false;
    await this.fetchData();
  }

  switchTab(tab: string) {
    this._activeTab = tab;
    this.render();
  }

  render() {
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
        }

        .app-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Fixed Header Area */
        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(253, 251, 247, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(139, 0, 0, 0.05);
          padding: 1rem 0 0.5rem;
        }

        .lesson-scroller {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 0.5rem 1rem 1rem;
          gap: 0.75rem;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }

        .lesson-scroller::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .lesson-chip {
          flex: 0 0 auto;
          padding: 0.5rem 1.25rem;
          border-radius: 50px;
          background: #fff;
          border: 1px solid rgba(139, 0, 0, 0.1);
          color: #666;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          box-shadow: var(--shadow-soft);
        }

        .lesson-chip.active {
          background: var(--primary-red, #8B0000);
          color: #fff;
          border-color: var(--primary-red, #8B0000);
          box-shadow: 0 4px 12px rgba(139, 0, 0, 0.25);
          transform: translateY(-2px);
        }

        /* Content Container */
        .app-container {
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
          padding: 1rem;
          flex: 1;
        }

        header {
          text-align: center;
          margin: 1.5rem 0 2rem;
          padding: 0 1rem;
        }

        h1 {
          font-size: clamp(1.5rem, 6vw, 2.25rem);
          line-height: 1.2;
          margin: 0;
          color: #8B0000;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* Modern Tabs */
        nav {
          display: flex;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(139, 0, 0, 0.08);
          border-radius: 16px;
          padding: 0.35rem;
          margin-bottom: 2rem;
          position: sticky;
          top: 5.5rem; /* Below lesson scroller */
          z-index: 900;
          backdrop-filter: blur(8px);
        }

        .tab-btn {
          flex: 1;
          border: none;
          background: none;
          padding: 0.75rem 0.5rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          color: #777;
          position: relative;
        }

        .tab-btn.active {
          background: #fff;
          color: #8B0000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        main {
          animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(139, 0, 0, 0.1);
          border-left-color: #8B0000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        footer {
          margin-top: 4rem;
          text-align: center;
          padding: 3rem 1rem;
          border-top: 1px solid rgba(0,0,0,0.03);
        }

        .footer-logo {
          color: #8B0000;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 2px;
          opacity: 0.4;
        }

        /* Utility for Galaxy S26 and other modern displays */
        .safe-area-top {
          height: env(safe-area-inset-top, 0px);
        }
      </style>
      
      <div class="app-shell">
        <div class="safe-area-top"></div>
        
        <div class="sticky-header">
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
            <div class="header-title">
              <h1>${this._data ? this._data.title.split('(')[0].trim() : 'HSK 4'}</h1>
              <p class="subtitle">${this._data ? this._data.title.split('(')[1]?.replace(')', '') || 'LOADING...' : 'HSK 4급 마스터'}</p>
            </div>
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
                <p style="color: #8B0000; font-weight: 600; font-size: 0.9rem;">콘텐츠를 준비 중입니다...</p>
              </div>
            `}
          </main>

          <footer>
            <div class="footer-logo">MODERN HAN ELEGANT • HSK 4 STANDARD</div>
          </footer>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.shadowRoot?.getElementById('tab-vocab')?.addEventListener('click', () => this.switchTab('vocab'));
    this.shadowRoot?.getElementById('tab-grammar')?.addEventListener('click', () => this.switchTab('grammar'));
    this.shadowRoot?.getElementById('tab-text')?.addEventListener('click', () => this.switchTab('text'));
    this.shadowRoot?.getElementById('tab-mastery')?.addEventListener('click', () => this.switchTab('mastery'));
    
    this.shadowRoot?.querySelectorAll('.lesson-chip').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt((item as HTMLElement).dataset.id || '1');
        this.selectLesson(id);
      });
    });

    // Auto-scroll the active chip into view
    const activeChip = this.shadowRoot?.querySelector('.lesson-chip.active');
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  renderContent() {
    if (!this._data) return '';

    switch (this._activeTab) {
      case 'vocab':
        return `
          <div class="vocab-list">
            ${this._data.vocabulary.map((v: any) => `
              <vocab-card id="v-${v.word}"></vocab-card>
            `).join('')}
          </div>
        `;
      case 'grammar':
        return `
          <div class="grammar-list">
            ${this._data.grammar.map((g: any) => `
              <grammar-card id="g-${g.point}"></grammar-card>
            `).join('')}
          </div>
        `;
      case 'text':
        return `
          <div class="text-list">
            ${this._data.texts.map((t: any) => `
              <text-section id="t-${t.id}"></text-section>
            `).join('')}
          </div>
        `;
      case 'mastery':
        return `
          <div class="mastery-section">
            <key-sentences id="mastery-sentences"></key-sentences>
          </div>
        `;
      default:
        return '';
    }
  }

  // Lifecycle to pass data to children after render
  updated() {
    if (!this._data) return;

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

  // Need to call updated manually since we aren't using a framework like Lit
  render_with_updates() {
    this.render();
    this.updated();
  }
}

// Override render for this specific vanilla implementation
const originalRender = App.prototype.render;
App.prototype.render = function() {
  originalRender.call(this);
  this.updated();
};

customElements.define('chn-vocab-app', App);
export default App;
