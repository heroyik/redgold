import '../features/review/VocabCard';
import '../components/GrammarCard';
import '../components/TextSection';
import '../components/KeySentences';
import '../components/SourceInfo';
import '../features/review/CardStack';

import { translateLessonData, getTextVocab, type AppLanguage } from '../utils/lessonTranslations';
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
  translations?: any;
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
  private _pinyinVisible: boolean = true;
  private _prefetchedLessons = new Map<number, LessonData>();
  private _prefetchedAudio = new Set<string>();
  private _redirectTimer: number | null = null;
  private readonly _redirectUrl = 'https://heroyik.gitlab.io/redgold/';
  private readonly _handlePopState = () => {
    this.applyLessonFromUrl({ replaceUrl: false, scroll: false });
  };

  
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
    this._pinyinVisible = this.getSavedPinyinVisible();
    this.setAttribute('data-pinyin-visible', this._pinyinVisible ? 'true' : 'false');
  }

  private normalizeLessonData(lesson: LessonData): LessonData {
    return {
      lessonId: lesson.lessonId,
      title: lesson.title,
      vocabulary: lesson.vocabulary || [],
      grammar: lesson.grammar || [],
      texts: lesson.texts || [],
      key_sentences: lesson.key_sentences || [],
      translations: lesson.translations,
    };
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

  getSavedPinyinVisible(): boolean {
    const saved = window.localStorage.getItem('redgold-pinyin-visible');
    if (saved === 'false') return false;
    return true;
  }

  setPinyinVisible(visible: boolean) {
    this._pinyinVisible = visible;
    this.setAttribute('data-pinyin-visible', visible ? 'true' : 'false');
    window.localStorage.setItem('redgold-pinyin-visible', visible ? 'true' : 'false');
    this.render();
  }

  private getCurrentLessonTitle() {
    return this._lessons.find(l => l.id === this._currentLesson)?.title || this._data?.title || 'HSK 4';
  }

  private getLessonHeaderParts() {
    const title = this.getCurrentLessonTitle();
    const dataTitleMatch = this._data?.title.match(/^Lesson\s+\d+:\s+.+?\s*\(([^)]+)\)\s*\(([^)]+)\)$/);
    const titleMatch = title.match(/^(Lesson\s+\d+:\s*.+?)(?:\s*\(([^)]+)\))?(?:\s*\(([^)]+)\))?$/);

    if (!titleMatch) {
      return { heading: title, subtitle: dataTitleMatch?.[1] || '' };
    }

    return {
      heading: titleMatch[1].trim(),
      subtitle: titleMatch[2] || dataTitleMatch?.[1] || '',
    };
  }

  connectedCallback() {
    window.addEventListener('popstate', this._handlePopState);
    this.applyLessonFromUrl({ replaceUrl: true, scroll: false });
    // Warm up the first visible lesson
    this.prefetchLesson(this._currentLesson);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._handlePopState);
    if (this._redirectTimer !== null) {
      window.clearTimeout(this._redirectTimer);
      this._redirectTimer = null;
    }
  }

  private getLessonFromUrl(): number | null {
    const value = new URLSearchParams(window.location.search).get('lesson');
    if (!value) return null;

    const id = Number(value);
    if (!Number.isInteger(id) || id < 1 || id > this._lessons.length) return null;
    return id;
  }

  private updateLessonUrl(id: number, mode: 'push' | 'replace' = 'push') {
    const url = new URL(window.location.href);
    url.searchParams.set('lesson', String(id));

    if (url.href === window.location.href) return;
    window.history[mode === 'replace' ? 'replaceState' : 'pushState']({}, '', url);
  }

  private clearLessonUrl(mode: 'push' | 'replace' = 'push') {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('lesson')) return;

    url.searchParams.delete('lesson');
    const search = url.searchParams.toString();
    const nextUrl = `${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
    window.history[mode === 'replace' ? 'replaceState' : 'pushState']({}, '', nextUrl);
  }

  private applyLessonFromUrl(options: { replaceUrl?: boolean; scroll?: boolean } = {}) {
    const lessonId = this.getLessonFromUrl();
    if (lessonId) {
      this.selectLesson(lessonId, {
        updateUrl: options.replaceUrl ? 'replace' : false,
        scroll: options.scroll ?? false,
      });
      return;
    }

    if (this._viewMode !== 'landing') {
      this.goHome({
        updateUrl: options.replaceUrl ? 'replace' : false,
        scroll: options.scroll ?? false,
      });
      return;
    }

    this.render();
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
        const normalizedLesson = this.normalizeLessonData(lesson);
        this._data = normalizedLesson;
        this._prefetchedLessons.set(this._currentLesson, normalizedLesson);
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
        const data = this.normalizeLessonData(await loader());
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

  async selectLesson(
    id: number,
    options: { updateUrl?: boolean | 'push' | 'replace'; scroll?: boolean } = {},
  ) {
    this._currentLesson = id;
    this._viewMode = 'lesson';
    const updateUrl = options.updateUrl ?? 'push';
    if (updateUrl) this.updateLessonUrl(id, updateUrl === 'replace' ? 'replace' : 'push');
    if (options.scroll ?? true) window.scrollTo({ top: 0, behavior: 'smooth' });
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

  goHome(options: { updateUrl?: boolean | 'push' | 'replace'; scroll?: boolean } = {}) {
    this._viewMode = 'landing';
    this._data = null;
    const updateUrl = options.updateUrl ?? 'push';
    if (updateUrl) this.clearLessonUrl(updateUrl === 'replace' ? 'replace' : 'push');
    if (options.scroll ?? true) window.scrollTo({ top: 0, behavior: 'smooth' });
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
          color: #f5f1e9;
          background: #12161c;
        }

        * {
          box-sizing: border-box;
        }

        .redirect-shell {
          min-height: 100vh;
          padding: clamp(0.4rem, 1vw, 0.8rem);
          background:
            linear-gradient(90deg, rgba(73, 244, 171, 0.08), transparent 15%),
            #12161c;
          display: flex;
          justify-content: center;
        }

        .redirect-card {
          width: min(100%, 1344px);
          min-height: min(920px, calc(100vh - 1rem));
          border: 1px solid rgba(229, 232, 238, 0.24);
          border-radius: 14px;
          background: linear-gradient(180deg, #14191f 0%, #11151b 100%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02), 0 28px 80px rgba(0, 0, 0, 0.32);
          padding: clamp(3rem, 7vw, 5.8rem);
          display: flex;
          align-items: center;
        }

        .redirect-content {
          width: min(100%, 980px);
        }

        .eyebrow {
          margin: 0 0 2.4rem;
          color: #4df4ab;
          font-size: clamp(1rem, 2vw, 1.6rem);
          font-weight: 900;
          letter-spacing: 0.28em;
          line-height: 1.1;
        }

        h1 {
          margin: 0 0 1.6rem;
          color: #f5f1e9;
          font-size: clamp(4.6rem, 8.4vw, 8rem);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.95;
          text-shadow: 0 2px 0 rgba(0, 0, 0, 0.65);
        }

        .copy {
          max-width: 990px;
          margin: 0;
          color: #dfd7ca;
          font-size: clamp(1.5rem, 2.25vw, 2rem);
          font-weight: 500;
          line-height: 1.6;
          text-shadow: 0 2px 0 #000;
        }

        .copy strong {
          color: #f5f1e9;
          font-weight: 900;
        }

        .migration-row {
          margin: 3.6rem 0 3.8rem;
          display: flex;
          align-items: center;
          gap: clamp(1.6rem, 3vw, 2.6rem);
        }

        .brand-icon {
          width: clamp(4.7rem, 7vw, 5.5rem);
          height: clamp(4.7rem, 7vw, 5.5rem);
          display: grid;
          place-items: center;
          color: #f5f1e9;
        }

        .brand-icon svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .arrow {
          width: clamp(7.5rem, 13vw, 10rem);
          color: #4df4ab;
          filter: drop-shadow(0 0 16px rgba(77, 244, 171, 0.18));
        }

        .arrow svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .gitlab-mark .fox-red {
          fill: #e24329;
        }

        .gitlab-mark .fox-orange {
          fill: #fc6d26;
        }

        .gitlab-mark .fox-yellow {
          fill: #fca326;
        }

        .redirect-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: min(100%, 424px);
          min-height: 96px;
          padding: 1.2rem 2rem;
          border: 0;
          border-radius: 13px;
          background: #4ae6a2;
          color: #071015;
          font-family: inherit;
          font-size: clamp(1.35rem, 2vw, 1.75rem);
          font-weight: 900;
          line-height: 1.1;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 22px 46px rgba(74, 230, 162, 0.08);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .redirect-btn:hover {
          background: #61f4b3;
          transform: translateY(-2px);
        }

        .note {
          margin: 2rem 0 0;
          color: #dfd7ca;
          font-size: clamp(1.3rem, 2vw, 1.75rem);
          line-height: 1.4;
          text-shadow: 0 2px 0 #000;
        }

        @media (max-width: 720px) {
          .redirect-shell {
            align-items: stretch;
          }

          .redirect-card {
            min-height: calc(100vh - 0.8rem);
            padding: 2.2rem 1.5rem;
            align-items: flex-start;
          }

          .eyebrow {
            margin-bottom: 1.8rem;
            font-size: 0.95rem;
          }

          h1 {
            font-size: clamp(3rem, 18vw, 5rem);
          }

          .copy {
            font-size: 1.18rem;
          }

          .migration-row {
            margin: 2.4rem 0;
            gap: 1rem;
          }

          .brand-icon {
            width: 4.2rem;
            height: 4.2rem;
          }

          .arrow {
            width: 5rem;
          }

          .redirect-btn {
            width: 100%;
            min-height: 76px;
          }

          .note {
            font-size: 1.08rem;
          }
        }
      </style>

      <main class="redirect-shell" aria-labelledby="redirect-title">
        <section class="redirect-card">
          <div class="redirect-content">
            <p class="eyebrow">NEW SPOT JUST DROPPED</p>
            <h1 id="redirect-title">GitLab era.</h1>
            <p class="copy">
              Big love, GitHub. You held it down. As of June 10, 2026, heroyik is
              pulling up at <strong>heroyik.gitlab.io</strong> now. Chill for 10 seconds and I will
              slide you over.
            </p>

            <div class="migration-row" aria-label="GitHub to GitLab">
              <div class="brand-icon" aria-label="GitHub">
                <svg viewBox="0 0 98 96" aria-hidden="true" fill="currentColor">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M48.85 0C21.88 0 0 22.05 0 49.25c0 21.75 14.03 40.18 33.49 46.69 2.45.45 3.35-1.07 3.35-2.39 0-1.18-.04-5.1-.07-9.25-13.62 2.98-16.5-5.86-16.5-5.86-2.23-5.71-5.44-7.23-5.44-7.23-4.45-3.06.34-3 .34-3 4.91.35 7.5 5.09 7.5 5.09 4.37 7.55 11.46 5.37 14.26 4.11.44-3.19 1.71-5.37 3.1-6.6-10.87-1.24-22.3-5.48-22.3-24.38 0-5.39 1.91-9.79 5.04-13.24-.51-1.24-2.18-6.27.48-13.06 0 0 4.11-1.33 13.45 5.06a46.56 46.56 0 0 1 24.5 0c9.34-6.39 13.44-5.06 13.44-5.06 2.67 6.79.99 11.82.49 13.06 3.14 3.45 5.04 7.85 5.04 13.24 0 18.95-11.45 23.13-22.35 24.35 1.76 1.53 3.32 4.54 3.32 9.15 0 6.6-.06 11.92-.06 13.54 0 1.33.88 2.87 3.37 2.38C83.98 89.4 98 70.98 98 49.25 98 22.05 75.83 0 48.85 0Z"/>
                </svg>
              </div>
              <div class="arrow" aria-hidden="true">
                <svg viewBox="0 0 168 60" fill="none">
                  <path d="M4 34C38 14 82 24 134 34" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
                  <path d="M122 16L160 36L121 50" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="brand-icon gitlab-mark" aria-label="GitLab">
                <svg viewBox="0 0 100 92" aria-hidden="true">
                  <path class="fox-orange" d="M50 91.2 68.4 34.5H31.6L50 91.2Z"/>
                  <path class="fox-red" d="M50 91.2 31.6 34.5H5.8L50 91.2Z"/>
                  <path class="fox-yellow" d="M5.8 34.5.2 51.8c-.5 1.5 0 3.2 1.3 4.1L50 91.2 5.8 34.5Z"/>
                  <path class="fox-red" d="M5.8 34.5h25.8L20.5.4c-.6-1.7-3-1.7-3.6 0L5.8 34.5Z"/>
                  <path class="fox-red" d="M50 91.2 68.4 34.5h25.8L50 91.2Z"/>
                  <path class="fox-yellow" d="m94.2 34.5 5.6 17.3c.5 1.5 0 3.2-1.3 4.1L50 91.2l44.2-56.7Z"/>
                  <path class="fox-red" d="M94.2 34.5H68.4L79.5.4c.6-1.7 3-1.7 3.6 0l11.1 34.1Z"/>
                </svg>
              </div>
            </div>

            <a class="redirect-btn" id="redirect-now" href="${this._redirectUrl}">Pull up on GitLab now</a>
            <p class="note">Ten seconds is optional. The new spot is already live.</p>
          </div>
        </section>
      </main>

    `;
  }

  renderLesson() {
    if (!this.shadowRoot) return;
    const ui = getUiCopy(this._language);

    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }
        :host {
          display: block;
          min-height: 100vh;
          font-family: 'Outfit', 'Noto Sans SC', sans-serif;
          color: #1a1a1a;
          overflow-x: hidden;
          background: #FDFBF7;
          box-sizing: border-box;
        }

        .app-shell {
          min-height: 100vh;
          padding-top: calc(var(--safe-top, 0px) + 3.55rem);
        }

        .sticky-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1100;
          background: rgba(253, 251, 247, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(139, 0, 0, 0.05);
          padding: calc(var(--safe-top, 0px) + 0.4rem) 0 0.4rem;
        }

        .header-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1rem;
          height: 44px;
        }

        .home-link {
          flex: 0 0 auto;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: transform 0.2s;
        }

        .home-link:active { transform: scale(0.9); }
        
        .home-icon {
          height: 1.8rem;
          width: auto;
          display: block;
        }

        .lesson-scroller {
          flex: 1;
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 0.4rem;
          scrollbar-width: none;
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }

        .lesson-scroller::-webkit-scrollbar { display: none; }

        .lesson-chip {
          flex: 0 0 auto;
          padding: 0.35rem 0.75rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(139, 0, 0, 0.05);
          color: #666;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .lesson-chip.active {
          background: #8B0000;
          color: #fff;
          border-color: #8B0000;
          box-shadow: 0 4px 12px rgba(139, 0, 0, 0.15);
        }

        .header-controls {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .mini-language-picker {
          display: inline-flex;
          gap: 0.15rem;
          padding: 0.15rem;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(139, 0, 0, 0.05);
        }

        .mini-language-btn {
          border: none;
          background: transparent;
          color: #888;
          font-size: 0.6rem;
          font-weight: 900;
          padding: 0.3rem 0.4rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mini-language-btn.active {
          background: #8B0000;
          color: #fff;
        }

        .pinyin-toggle {
          border: none;
          background: transparent;
          color: #888;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 0.3rem 0.35rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Noto Sans SC', sans-serif;
          line-height: 1;
        }

        .pinyin-toggle.active {
          background: #8B0000;
          color: #fff;
        }

        .pinyin-toggle:not(.active) {
          opacity: 0.5;
        }

        :host([data-pinyin-visible="false"]) .subtitle {
          display: none;
        }

        .app-container {
          max-width: 1120px;
          margin: 0 auto;
          width: 100%;
          padding: 1rem clamp(0.75rem, 3vw, 2rem);
          box-sizing: border-box;
        }

        .lesson-toolbar {
          position: sticky;
          top: calc(var(--safe-top, 0px) + 3.55rem);
          z-index: 950;
          margin-bottom: 1.5rem;
          padding: 0.65rem 0 0.75rem;
          background: rgba(253, 251, 247, 0.94);
          border-bottom: 1px solid rgba(139, 0, 0, 0.06);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        @media (max-width: 600px) {
          .app-container {
            padding: 1rem 0.5rem;
          }
        }

        header {
          text-align: center;
          margin: 0 0 1rem;
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

        .locale-title {
          color: #888;
          font-size: 0.9rem;
          margin-top: 0.6rem;
          font-weight: 400;
        }

        nav {
          display: flex;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(139, 0, 0, 0.1);
          border-radius: 24px;
          padding: 0.25rem;
          margin-bottom: 0;
          position: static;
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

        .content-panel {
          width: 100%;
          min-width: 0;
          margin: 0 auto;
        }

        .content-panel.reading {
          max-width: 860px;
        }

        .content-panel.review {
          max-width: 620px;
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

        .vocab-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
          gap: clamp(0.75rem, 2vw, 1.25rem);
          padding-bottom: 2rem;
          width: 100%;
          min-width: 0;
        }

        .vocab-list vocab-card {
          width: 100%;
          min-height: 56px;
          height: auto;
          perspective: 1000px;
        }

        .grammar-list,
        .text-list,
        .mastery-section {
          width: 100%;
          min-width: 0;
        }
      </style>
      
      <div class="app-shell">
        <div class="sticky-header">
          <div class="header-row">
            <div class="home-link" id="home-link">
              <img src="/redgold/assets/home-icon.png" alt="Home" class="home-icon">
            </div>
            
            <div class="lesson-scroller">
              ${this._lessons.map(l => `
                <div class="lesson-chip ${this._currentLesson === l.id ? 'active' : ''}" data-id="${l.id}">
                   L${l.id}
                </div>
              `).join('')}
            </div>

            <div class="header-controls">
              <div class="mini-language-picker">
                <button class="mini-language-btn ${this._language === 'en' ? 'active' : ''}" data-lang="en">EN</button>
                <button class="mini-language-btn ${this._language === 'ko' ? 'active' : ''}" data-lang="ko">KO</button>
                <button class="mini-language-btn ${this._language === 'ja' ? 'active' : ''}" data-lang="ja">JP</button>
              </div>
              <button class="pinyin-toggle ${this._pinyinVisible ? 'active' : ''}" id="pinyin-toggle">拼</button>
            </div>
          </div>
        </div>

        <div class="app-container">
          <div class="lesson-toolbar">
            <header>
              ${(() => {
                const lessonHeader = this.getLessonHeaderParts();
                return `
                  <h1>${lessonHeader.heading}</h1>
                  <p class="subtitle">${lessonHeader.subtitle}</p>
                `;
              })()}
              ${this._data && this._data.translations?.lessonTitle?.[this._language] ? `<p class="locale-title">${this._data.translations.lessonTitle[this._language]}</p>` : ''}
            </header>

            <nav>
              <button class="tab-btn ${this._activeTab === 'vocab' ? 'active' : ''}" id="tab-vocab">${ui.tabVocab}</button>
              <button class="tab-btn ${this._activeTab === 'grammar' ? 'active' : ''}" id="tab-grammar">${ui.tabGrammar}</button>
              <button class="tab-btn ${this._activeTab === 'text' ? 'active' : ''}" id="tab-text">${ui.tabTexts}</button>
              <button class="tab-btn ${this._activeTab === 'review' ? 'active' : ''}" id="tab-review">${ui.tabReview}</button>
              <button class="tab-btn ${this._activeTab === 'mastery' ? 'active' : ''}" id="tab-mastery">${ui.tabMastery}</button>
            </nav>
          </div>

          <main>
            ${this._data ? this.renderContent() : `
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

    // Initialize User Menus

    if (this._redirectTimer !== null) {
      window.clearTimeout(this._redirectTimer);
      this._redirectTimer = null;
    }

    if (this._viewMode === 'landing') {
      root.getElementById('redirect-now')?.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.assign(this._redirectUrl);
      });
      this._redirectTimer = window.setTimeout(() => {
        window.location.assign(this._redirectUrl);
      }, 10000);

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
      root.getElementById('pinyin-toggle-lang')?.addEventListener('click', () => {
        this.setPinyinVisible(!this._pinyinVisible);
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
      root.getElementById('tab-review')?.addEventListener('click', () => this.switchTab('review'));
      root.getElementById('tab-mastery')?.addEventListener('click', () => this.switchTab('mastery'));
      
      root.getElementById('pinyin-toggle')?.addEventListener('click', () => {
        this.setPinyinVisible(!this._pinyinVisible);
      });
      
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

    const localizedLesson = translateLessonData(this._data, this._language);

    switch (this._activeTab) {
      case 'vocab':
        const vocabItems = getTextVocab(localizedLesson);
        return `<div class="vocab-list">${vocabItems.map((v: any) => `<vocab-card id="v-${v.word}"></vocab-card>`).join('')}</div>`;
      case 'grammar':
        return `<div class="content-panel reading"><div class="grammar-list">${localizedLesson.grammar.map((g: any) => `<grammar-card id="g-${g.point}"></grammar-card>`).join('')}</div></div>`;
      case 'text':
        return `<div class="content-panel reading"><div class="text-list">${localizedLesson.texts.map((t: any) => `<text-section id="t-${t.id}"></text-section>`).join('')}</div></div>`;
      case 'mastery':
        return `<div class="content-panel reading"><div class="mastery-section"><key-sentences id="mastery-sentences"></key-sentences></div></div>`;
      case 'review':
        return `<div class="content-panel review"><card-stack id="review-stack"></card-stack></div>`;
      default:
        return '';
    }
  }

  updated() {
    if (!this._data || this._viewMode === 'landing') return;

    const lessonData = translateLessonData(this._data, this._language);

    const pinyinVisible = this._pinyinVisible;

    if (this._activeTab === 'vocab') {
      const vocabItems = getTextVocab(lessonData);
      vocabItems.forEach((v: any) => {
        const el = this.shadowRoot?.getElementById(`v-${v.word}`) as any;
        if (el) {
          el.language = this._language;
          el.compact = true;
          el.pinyinVisible = pinyinVisible;
          el.data = v;
        }
      });
    } else if (this._activeTab === 'grammar') {
      lessonData.grammar.forEach((g: any) => {
        const el = this.shadowRoot?.getElementById(`g-${g.point}`) as any;
        if (el) {
          el.language = this._language;
          el.pinyinVisible = pinyinVisible;
          el.data = g;
        }
      });
    } else if (this._activeTab === 'text') {
      lessonData.texts.forEach((t: any) => {
        const el = this.shadowRoot?.getElementById(`t-${t.id}`) as any;
        if (el) {
          el.language = this._language;
          el.pinyinVisible = pinyinVisible;
          el.data = t;
        }
      });
    } else if (this._activeTab === 'mastery') {
      const el = this.shadowRoot?.getElementById('mastery-sentences') as any;
      if (el) {
        el.language = this._language;
        el.pinyinVisible = pinyinVisible;
        el.sentences = lessonData.key_sentences;
      }
    } else if (this._activeTab === 'review') {
      const el = this.shadowRoot?.getElementById('review-stack') as any;
      if (el) {
        el.language = this._language;
        el.vocabulary = getTextVocab(lessonData);
      }
    }
  }
}

customElements.define('chn-vocab-app', App);
export default App;
