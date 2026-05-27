/**
 * <text-section> Web Component
 * Displays dialogues and monologues from the textbook.
 */
import { getUiCopy } from '../utils/uiCopy';
import type { AppLanguage } from '../utils/lessonTranslations';

export class TextSection extends HTMLElement {
  private _data: any = null;
  private _language: AppLanguage = 'en';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(value: any) {
    this._data = value;
    this.render();
  }

  set language(value: AppLanguage) {
    this._language = value;
    this.setAttribute('data-lang', value);
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._data || !this.shadowRoot) return;
    const ui = getUiCopy(this._language);

    // Check if this is a monologue (all speakers are "独白")
    const isMonologue = this._data.content && this._data.content.length > 0 &&
      this._data.content.every((line: any) => line.speaker === '独白');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 2.5rem;
          width: 100%;
          min-width: 0;
        }

        .text-container {
          background: rgba(255, 255, 255, 0.5);
          border-radius: 28px;
          padding: clamp(1rem, 3vw, 2rem) clamp(0.9rem, 3vw, 1.5rem);
          border: 1px solid rgba(139, 0, 0, 0.08);
          box-shadow: var(--shadow-soft, 0 4px 12px rgba(0, 0, 0, 0.05));
          min-width: 0;
          box-sizing: border-box;
        }

        h3 {
          margin-top: 0;
          color: #8B0000;
          font-size: 1.25rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(139, 0, 0, 0.1);
          font-family: 'Outfit', sans-serif;
          min-width: 0;
        }

        .audio-control {
          background: rgba(139, 0, 0, 0.05);
          border: 1px solid rgba(139, 0, 0, 0.1);
          padding: 8px 16px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.75rem;
          font-weight: 800;
          color: #8B0000;
          backdrop-filter: blur(4px);
          flex: 0 0 auto;
        }

        .audio-control:hover {
          background: rgba(139, 0, 0, 0.1);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(139, 0, 0, 0.1);
        }

        .audio-control.playing {
          background: #8B0000;
          color: #fff;
          border-color: #8B0000;
        }

        .audio-control svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
        }

        .dialogue {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        /* Monologue: continuous paragraph style */
        .dialogue.monologue {
          gap: 0;
        }

        .line {
          padding: 1.25rem;
          border-radius: 20px;
          margin-bottom: 0.75rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          min-width: 0;
        }

        .line:hover {
          background: rgba(255, 255, 255, 0.6);
          transform: translateX(4px);
        }

        .line.active {
          border-color: rgba(139, 0, 0, 0.05);
        }

        /* Monologue line: flush continuous passage */
        .line.monologue {
          padding: 0.15rem 1.25rem;
          margin-bottom: 0;
          border-radius: 0;
          background: transparent;
          border: none;
          border-left: 3px solid transparent;
        }

        .line.monologue:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: none;
        }

        .line.monologue.active {
          border-left-color: #8B0000;
          background: rgba(139, 0, 0, 0.04);
        }

        .line.monologue + .line.monologue {
          border-top: none;
        }

        /* Monologue: hide per-line pinyin/translation, show as combined blocks below */
        .line.monologue .content .pinyin,
        .line.monologue .content .translation {
          display: none;
        }

        .line.monologue .content .main-text {
          display: inline;
        }

        /* Combined pinyin block */
        .monologue-pinyin {
          margin-top: 2rem;
          padding: 1.25rem 1.5rem;
          background: rgba(139, 0, 0, 0.03);
          border-radius: 20px;
          border: 1px solid rgba(139, 0, 0, 0.06);
          font-size: 0.9rem;
          line-height: 1.8;
          color: #8B0000;
          font-weight: 600;
          opacity: 0.7;
        }

        .monologue-pinyin-label {
          font-size: 0.6rem;
          font-weight: 900;
          color: #8B0000;
          opacity: 0.4;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 0.5rem;
        }

        /* Combined translation block */
        .monologue-translation {
          margin-top: 1rem;
          padding: 1.25rem 1.5rem;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          font-weight: 400;
        }

        .monologue-translation-label {
          font-size: 0.6rem;
          font-weight: 900;
          color: #666;
          opacity: 0.4;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 0.5rem;
        }

        .speaker {
          font-weight: 800;
          font-size: 0.7rem;
          color: #8B0000;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          opacity: 0.8;
          display: inline-block;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .content {
          font-size: 1.15rem;
          line-height: 1.5;
          color: #1a1a1a;
          font-family: 'Noto Sans SC', sans-serif;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .pinyin {
          font-size: 0.8rem;
          color: #8B0000;
          margin-top: 0.5rem;
          font-weight: 600;
          opacity: 0.6;
          overflow-wrap: anywhere;
        }

        .translation {
          font-size: 0.95rem;
          color: #555;
          margin-top: 0.5rem;
          line-height: 1.4;
          font-weight: 400;
          word-break: normal;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        :host([data-lang="ko"]) .translation,
        :host([data-lang="ja"]) .translation,
        :host([data-lang="ko"]) .monologue-translation,
        :host([data-lang="ja"]) .monologue-translation,
        :host([data-lang="ko"]) .vocab-item .meaning,
        :host([data-lang="ja"]) .vocab-item .meaning {
          word-break: keep-all;
          overflow-wrap: anywhere;
        }



        /* Vocabulary Section */
        .vocab-section {
          margin-top: 3rem;
          padding: 2rem;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3));
          border-radius: 32px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
        }

        .vocab-header {
          font-size: 0.75rem;
          font-weight: 800;
          color: #8B0000;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
          opacity: 0.7;
          text-align: center;
        }

        .vocab-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
        }

        .vocab-item {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.4rem;
          text-align: left;
          padding: 1rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
          min-width: 0;
        }

        .vocab-item:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
        }

        .vocab-item .num {
          min-width: 2.2rem;
          font-size: 0.78rem;
          font-weight: 800;
          color: #8B0000;
          opacity: 0.8;
        }

        .vocab-item .word {
          font-size: 1.1rem;
          font-weight: 700;
          font-family: 'Noto Sans SC', sans-serif;
          color: #1a1a1a;
        }

        .vocab-item .pinyin {
          font-size: 0.75rem;
          margin: 0;
          color: inherit;
          opacity: 0.7;
          font-weight: 600;
        }

        .vocab-item .meaning {
          font-size: 0.8rem;
          opacity: 0.6;
          margin-top: 0;
          line-height: 1.45;
          overflow-wrap: break-word;
          min-width: 0;
        }

        /* Proper Nouns Section */
        .proper-nouns-section {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(218, 165, 32, 0.05);
          border-radius: 24px;
          border: 1px solid rgba(218, 165, 32, 0.15);
        }

        .proper-header {
          font-size: 0.7rem;
          font-weight: 800;
          color: #DAA520;
          letter-spacing: 1.5px;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }

        .proper-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .proper-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .proper-item .word {
          font-weight: 700;
          color: #1a1a1a;
          font-size: 1rem;
        }

        .proper-item .pinyin {
          font-size: 0.7rem;
          color: #DAA520;
          margin: 0;
          opacity: 0.8;
        }

        .proper-item .meaning {
          font-size: 0.7rem;
          opacity: 0.6;
          margin-top: 1px;
        }
      </style>

      <div class="text-container">
        <h3>
          <span>${ui.textTitlePrefix} ${this._data.id}: ${this._data.title}</span>
          ${this._data.audio ? `
            <button class="audio-control" id="play-btn">
              <svg viewBox="0 0 24 24" id="play-icon">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg viewBox="0 0 24 24" id="pause-icon" style="display:none;">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
              <span>${ui.listening}</span>
            </button>
          ` : ''}
        </h3>
        
        ${this._data.audio ? `<audio id="audio-player" src="${this._data.audio}"></audio>` : ''}

        <div class="dialogue ${isMonologue ? 'monologue' : ''}" id="dialogue-container">
          ${this._data.content.map((line: any, index: number) => `
            <div class="line ${isMonologue ? 'monologue' : ''}" id="line-${index}">
              ${!isMonologue ? `<span class="speaker">${line.speaker}</span>` : ''}
              <div class="content">
                <div class="main-text">${line.text}</div>
                ${!isMonologue && line.pinyin ? `<div class="pinyin">${line.pinyin}</div>` : ''}
                ${!isMonologue && line.translation ? `<div class="translation">${line.translation}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        ${isMonologue ? `
          <div class="monologue-pinyin">
            <div class="monologue-pinyin-label">${ui.pinyinLabel}</div>
            ${this._data.content.map((line: any) => line.pinyin || '').filter(Boolean).join(' ')}
          </div>
          <div class="monologue-translation">
            <div class="monologue-translation-label">${ui.translationLabel}</div>
            ${this._data.content.map((line: any) => line.translation || '').filter(Boolean).join(' ')}
          </div>
        ` : ''}

        ${this._data.vocabulary && this._data.vocabulary.length > 0 ? `
          <div class="vocab-section">
            <div class="vocab-header">${ui.newWords}</div>
            <div class="vocab-grid">
              ${this._data.vocabulary.map((v: any, index: number) => `
                <div class="vocab-item" id="vocab-${index}">
                  <span class="num">${index + 1}.</span>
                  <span class="word">${v.word}</span>
                  <span class="pinyin">${v.pinyin}</span>
                  <span class="meaning">${v.meaning}</span>
                </div>
              `).join('')}
            </div>
            
            ${this._data.proper_nouns && this._data.proper_nouns.length > 0 ? `
              <div class="proper-nouns-section">
                <div class="proper-header">${ui.properNouns}</div>
                <div class="proper-grid">
                  ${this._data.proper_nouns.map((pn: any, index: number) => `
                    <div class="proper-item" id="proper-${index}">
                      <span class="word">${pn.word}</span>
                      <span class="pinyin">${pn.pinyin}</span>
                      ${pn.meaning ? `<span class="meaning">(${pn.meaning})</span>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;

    this.setupAudio();
  }

  setupAudio() {
    if (!this.shadowRoot) return;
    const playBtn = this.shadowRoot.getElementById('play-btn');
    const audio = this.shadowRoot.getElementById('audio-player') as HTMLAudioElement;
    const playIcon = this.shadowRoot.getElementById('play-icon');
    const pauseIcon = this.shadowRoot.getElementById('pause-icon');

    if (!playBtn || !audio) return;

    // Calculate timings based on character weights
    let timings: { id: string; start: number; end: number }[] = [];
    let maxScrolledIndex = -1; // Keep track of the furthest scrolled element
    
    const stripHTML = (html: string) => {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    const refreshTimings = () => {
      const textLines = this._data.content || [];
      const vocabLines = this._data.vocabulary || [];
      const properLines = this._data.proper_nouns || [];
      
      const duration = audio.duration;
      if (!duration || duration === Infinity) return;

      const introDuration = Math.min(1.5, duration * 0.05);
      const remainingDuration = duration - introDuration;

      const getLineWeight = (text: string, pinyin: string) => {
        const cleanText = stripHTML(text);
        return cleanText.length + (pinyin?.length || 0) * 0.3;
      };

      const dialogueWeights = textLines.map((l: any) => getLineWeight(l.text, l.pinyin));
      const vocabWeights = vocabLines.map((v: any) => getLineWeight(v.word, v.pinyin) + 2);
      const properWeights = properLines.map((pn: any) => getLineWeight(pn.word, pn.pinyin));

      const totalWeight = [
        ...dialogueWeights,
        ...vocabWeights,
        ...properWeights
      ].reduce((a, b) => a + b, 0);
      
      if (totalWeight === 0) return;

      let currentPos = introDuration;
      timings = [];
      
      textLines.forEach((_: any, i: number) => {
        const weight = dialogueWeights[i];
        const lineDuration = (weight / totalWeight) * remainingDuration;
        timings.push({ id: `line-${i}`, start: currentPos, end: currentPos + lineDuration });
        currentPos += lineDuration;
      });

      vocabLines.forEach((_: any, i: number) => {
        const weight = vocabWeights[i];
        const lineDuration = (weight / totalWeight) * remainingDuration;
        timings.push({ id: `vocab-${i}`, start: currentPos, end: currentPos + lineDuration });
        currentPos += lineDuration;
      });

      properLines.forEach((_: any, i: number) => {
        const weight = properWeights[i];
        const lineDuration = (weight / totalWeight) * remainingDuration;
        timings.push({ id: `proper-${i}`, start: currentPos, end: currentPos + lineDuration });
        currentPos += lineDuration;
      });
    };

    audio.addEventListener('loadedmetadata', refreshTimings);

    audio.addEventListener('timeupdate', () => {
      if (timings.length === 0) refreshTimings();
      const currentTime = audio.currentTime;
      
      timings.forEach((t, index) => {
        if (currentTime >= t.start && currentTime < t.end) {
          // Only scroll if we are moving forward in the audio
          if (index > maxScrolledIndex) {
            maxScrolledIndex = index;
            const el = this.shadowRoot?.getElementById(t.id);
            
            // Remove previous active markers (hidden logic)
            this.shadowRoot?.querySelectorAll('.active').forEach(item => {
              if (item !== playBtn) item.classList.remove('active');
            });
            el?.classList.add('active');
            
            // Only scroll forward
            el?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
            });
          }
        }
      });
    });

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        document.querySelectorAll('text-section').forEach((el: any) => {
          const otherAudio = el.shadowRoot?.getElementById('audio-player') as HTMLAudioElement;
          if (otherAudio && otherAudio !== audio) {
            otherAudio.pause();
            const otherBtn = el.shadowRoot?.getElementById('play-btn');
            const otherPlayIcon = el.shadowRoot?.getElementById('play-icon');
            const otherPauseIcon = el.shadowRoot?.getElementById('pause-icon');
            if (otherBtn) {
              otherBtn.classList.remove('playing');
              if (otherPlayIcon) otherPlayIcon.style.display = 'block';
              if (otherPauseIcon) otherPauseIcon.style.display = 'none';
            }
          }
        });

        audio.play();
        playBtn.classList.add('playing');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
      } else {
        audio.pause();
        playBtn.classList.remove('playing');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
      }
    });

    audio.addEventListener('ended', () => {
      playBtn.classList.remove('playing');
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      this.shadowRoot?.querySelectorAll('.active').forEach(item => {
        if (item !== playBtn) item.classList.remove('active');
      });

      // After audio ends, scroll to vocab section so it's visible
      const vocabSection = this.shadowRoot?.querySelector('.vocab-section');
      if (vocabSection) {
        vocabSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }


}

customElements.define('text-section', TextSection);
