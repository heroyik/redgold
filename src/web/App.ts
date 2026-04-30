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
          font-family: 'Inter', 'Noto Sans SC', system-ui, -apple-system, sans-serif;
          background: #F5F5DC url('https://www.transparenttextures.com/patterns/handmade-paper.png');
          color: #1a1a1a;
          padding-bottom: 5rem;
        }

        .app-container {
          max-width: 600px;
          margin: 0 auto;
          padding: env(safe-area-inset-top) 1rem env(safe-area-inset-bottom);
        }

        header {
          padding: 2.5rem 0 1.5rem;
          text-align: center;
        }

        .header-title {
          position: relative;
          display: inline-block;
        }

        h1 {
          font-size: 2.5rem;
          margin: 0;
          color: #8B0000;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .subtitle {
          color: #555;
          font-size: 0.95rem;
          margin-top: 0.5rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        nav {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          padding: 0.5rem;
          border-radius: 50px;
          border: 1px solid rgba(139, 0, 0, 0.1);
          position: sticky;
          top: 1rem;
          z-index: 100;
        }

        .tab-btn {
          border: none;
          background: none;
          padding: 0.6rem 1.25rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          color: #666;
        }

        .tab-btn.active {
          background: #8B0000;
          color: #fff;
          box-shadow: 0 4px 12px rgba(139, 0, 0, 0.2);
        }

        main {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(139, 0, 0, 0.1);
          border-left-color: #8B0000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        footer {
          margin-top: 4rem;
          text-align: center;
          padding: 2rem;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .footer-logo {
          color: #8B0000;
          font-weight: 800;
          font-size: 0.8rem;
          opacity: 0.6;
        }

        /* Sidebar Styles */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
        }

        .sidebar-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: -280px;
          width: 280px;
          height: 100%;
          background: #F5F5DC;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
          z-index: 1001;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .sidebar.open {
          left: 0;
        }

        .sidebar-header {
          margin-bottom: 2rem;
          border-bottom: 2px solid #8B0000;
          padding-bottom: 1rem;
        }

        .sidebar-header h2 {
          color: #8B0000;
          margin: 0;
          font-size: 1.5rem;
        }

        .lesson-item {
          padding: 1rem;
          margin-bottom: 0.5rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          color: #444;
          border: 1px solid transparent;
        }

        .lesson-item:hover {
          background: rgba(139, 0, 0, 0.05);
          color: #8B0000;
        }

        .lesson-item.active {
          background: rgba(139, 0, 0, 0.1);
          color: #8B0000;
          border-color: rgba(139, 0, 0, 0.2);
          font-weight: 700;
        }

        .menu-toggle {
          position: fixed;
          top: 1.5rem;
          left: 1rem;
          z-index: 500;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(139, 0, 0, 0.2);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #8B0000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          backdrop-filter: blur(5px);
        }
      </style>
      
      <div class="menu-toggle" id="menu-toggle">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </div>

      <div class="sidebar-overlay ${this._isSidebarOpen ? 'open' : ''}" id="sidebar-overlay"></div>
      <div class="sidebar ${this._isSidebarOpen ? 'open' : ''}">
        <div class="sidebar-header">
          <h2>HSK 4 Standard</h2>
        </div>
        <div class="lesson-list">
          ${this._lessons.map(l => `
            <div class="lesson-item ${this._currentLesson === l.id ? 'active' : ''}" data-id="${l.id}">
              ${l.title}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="app-container">
        <header>
          <div class="header-title">
            <h1>${this._data ? this._data.title.split('(')[0].trim() : '중국어 학습'}</h1>
            <p class="subtitle">${this._data ? this._data.title.split('(')[1]?.replace(')', '') || '' : 'HSK 4급 마스터'}</p>
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
              <p>콘텐츠를 준비 중입니다...</p>
            </div>
          `}
        </main>

        <footer>
          <div class="footer-logo">MODERN HAN ELEGANT • HSK 4A</div>
        </footer>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.shadowRoot?.getElementById('tab-vocab')?.addEventListener('click', () => this.switchTab('vocab'));
    this.shadowRoot?.getElementById('tab-grammar')?.addEventListener('click', () => this.switchTab('grammar'));
    this.shadowRoot?.getElementById('tab-text')?.addEventListener('click', () => this.switchTab('text'));
    this.shadowRoot?.getElementById('tab-mastery')?.addEventListener('click', () => this.switchTab('mastery'));
    
    this.shadowRoot?.getElementById('menu-toggle')?.addEventListener('click', () => this.toggleSidebar());
    this.shadowRoot?.getElementById('sidebar-overlay')?.addEventListener('click', () => this.toggleSidebar());
    
    this.shadowRoot?.querySelectorAll('.lesson-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt((item as HTMLElement).dataset.id || '1');
        this.selectLesson(id);
      });
    });
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
