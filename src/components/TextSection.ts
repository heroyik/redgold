/**
 * <text-section> Web Component
 * Displays dialogues and monologues from the textbook.
 */
export class TextSection extends HTMLElement {
  private _data: any = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(value: any) {
    this._data = value;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._data || !this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 2.5rem;
          width: 100%;
        }

        .text-container {
          background: rgba(255, 255, 255, 0.5);
          border-radius: 28px;
          padding: 2rem 1.5rem;
          border: 1px solid rgba(139, 0, 0, 0.08);
          box-shadow: var(--shadow-soft, 0 4px 12px rgba(0, 0, 0, 0.05));
        }

        h3 {
          margin-top: 0;
          color: #8B0000;
          font-size: 1.25rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(139, 0, 0, 0.1);
          font-family: 'Outfit', sans-serif;
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

        .line {
          padding: 1.25rem;
          border-radius: 20px;
          margin-bottom: 0.75rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
        }

        .line:hover {
          background: rgba(255, 255, 255, 0.6);
          transform: translateX(4px);
        }

        .line.active {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(139, 0, 0, 0.15);
          box-shadow: 0 12px 24px rgba(139, 0, 0, 0.08);
          transform: scale(1.02);
          z-index: 10;
        }

        .line.active .speaker {
          background: #8B0000;
          color: #fff;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .line.active .main-text {
          color: #8B0000;
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
        }

        .pinyin {
          font-size: 0.8rem;
          color: #8B0000;
          margin-top: 0.5rem;
          font-weight: 600;
          opacity: 0.6;
        }

        .translation {
          font-size: 0.95rem;
          color: #555;
          margin-top: 0.5rem;
          line-height: 1.4;
          font-weight: 400;
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
          grid-template-columns: 1fr;
        }

        @media (min-width: 480px) {
          .vocab-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .vocab-item {
          text-align: center;
          padding: 1rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .vocab-item:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
        }

        .vocab-item .word {
          font-size: 1.1rem;
          font-weight: 700;
          font-family: 'Noto Sans SC', sans-serif;
        }

        .vocab-item .pinyin {
          font-size: 0.75rem;
          margin: 0;
          color: inherit;
          opacity: 0.7;
        }

        .vocab-item.active .pinyin {
          color: #fff;
          opacity: 0.9;
        }

        .vocab-item .meaning {
          font-size: 0.8rem;
          opacity: 0.6;
          margin-top: 0.25rem;
        }

        .vocab-item.active .meaning {
          color: #fff;
          opacity: 0.8;
        }
      </style>

      <div class="text-container">
        <h3>
          <span>课文 ${this._data.id}: ${this._data.title}</span>
          ${this._data.audio ? `
            <button class="audio-control" id="play-btn">
              <svg viewBox="0 0 24 24" id="play-icon">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg viewBox="0 0 24 24" id="pause-icon" style="display:none;">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
              <span>LISTENING</span>
            </button>
          ` : ''}
        </h3>
        
        ${this._data.audio ? `<audio id="audio-player" src="${this._data.audio}"></audio>` : ''}

        <div class="dialogue" id="dialogue-container">
          ${this._data.content.map((line: any, index: number) => `
            <div class="line" id="line-${index}">
              <span class="speaker">${line.speaker}</span>
              <div class="content">
                <div class="main-text">${line.text}</div>
                ${line.pinyin ? `<div class="pinyin">${line.pinyin}</div>` : ''}
                ${line.translation ? `<div class="translation">${line.translation}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        ${this._data.vocabulary && this._data.vocabulary.length > 0 ? `
          <div class="vocab-section">
            <div class="vocab-header">NEW WORDS IN THIS TEXT</div>
            <div class="vocab-grid">
              ${this._data.vocabulary.map((v: any, index: number) => `
                <div class="vocab-item" id="vocab-${index}">
                  <span class="word">${v.word}</span>
                  <span class="pinyin">${v.pinyin}</span>
                  <span class="meaning">${v.meaning}</span>
                </div>
              `).join('')}
            </div>
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
    
    const refreshTimings = () => {
      const textLines = this._data.content || [];
      
      // Calculate weights (Chinese chars are heavier, pinyin is lighter)
      const lineWeights = textLines.map((l: any) => l.text.length + (l.pinyin?.length || 0) * 0.3);
      const totalWeight = lineWeights.reduce((a: number, b: number) => a + b, 0);
      
      const duration = audio.duration;
      if (!duration || duration === Infinity) return;
      
      let currentPos = 0;
      timings = [];
      
      textLines.forEach((_: any, i: number) => {
        const weight = lineWeights[i];
        const lineDuration = (weight / totalWeight) * duration;
        timings.push({ id: `line-${i}`, start: currentPos, end: currentPos + lineDuration });
        currentPos += lineDuration;
      });
    };

    audio.addEventListener('loadedmetadata', refreshTimings);

    audio.addEventListener('timeupdate', () => {
      if (timings.length === 0) refreshTimings();
      const currentTime = audio.currentTime;
      
      timings.forEach(t => {
        const el = this.shadowRoot?.getElementById(t.id);
        if (currentTime >= t.start && currentTime < t.end) {
          if (!el?.classList.contains('active')) {
            this.shadowRoot?.querySelectorAll('.active').forEach(item => {
              if (item !== playBtn) item.classList.remove('active');
            });
            el?.classList.add('active');
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
