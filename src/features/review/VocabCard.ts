import { VocabItem } from './ReviewState';
import { ReviewStyles } from './ReviewStyles';
import { getUiCopy, AppLanguage } from '../../utils/uiCopy';

export class VocabCardComponent extends HTMLElement {
  private _data: VocabItem | null = null;
  private _isFlipped = false;
  private _language = 'en';
  private _compact = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(value: VocabItem) {
    this._data = value;
    this.render();
  }

  set language(value: string) {
    this._language = value;
    this.setAttribute('data-lang', value);
    this.render();
  }

  set compact(value: boolean) {
    this._compact = value;
    this.render();
  }

  toggleFlip() {
    this._isFlipped = !this._isFlipped;
    const inner = this.shadowRoot?.querySelector('.vocab-card-inner');
    if (inner) {
      inner.classList.toggle('is-flipped', this._isFlipped);
    }
    
    // Play audio when flipping to back
    if (this._isFlipped && this._data?.audio) {
      const audio = this.shadowRoot?.getElementById('card-audio') as HTMLAudioElement;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }
  }

  private getHint() {
    const ui = getUiCopy(this._language as AppLanguage);
    return { front: ui.tapToFlipFront, back: ui.tapToFlipBack };
  }

  render() {
    if (!this._data || !this.shadowRoot) return;

    const ui = getUiCopy(this._language as AppLanguage);
    const hint = this.getHint();

    if (this._compact) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            height: 100%;
            min-width: 0;
            container-type: inline-size;
          }
          
          .compact-card {
            width: 100%;
            height: 100%;
            min-height: 3.5rem;
            border-radius: 16px;
            display: grid;
            grid-template-columns: auto minmax(4.5rem, auto) minmax(0, 1fr) auto;
            gap: 0.25rem 0.75rem;
            align-items: center;
            padding: 0.5rem 1rem;
            ${ReviewStyles.glassCard}
            box-sizing: border-box;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            border: 1px solid rgba(139, 0, 0, 0.05);
          }

          .compact-card:hover {
            background: rgba(255, 255, 255, 0.98);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(139, 0, 0, 0.08);
            border-color: rgba(139, 0, 0, 0.1);
          }

          .compact-card:active {
            transform: translateY(0) scale(0.98);
            background: rgba(255, 255, 255, 0.9);
          }

          .word {
            font-family: ${ReviewStyles.typography.serif};
            font-size: clamp(1.1rem, 3.5vw, 1.45rem);
            font-weight: 900;
            color: ${ReviewStyles.colors.deepRed};
            margin: 0;
            line-height: 1.2;
            word-break: keep-all;
            overflow-wrap: normal;
            min-width: 0;
          }

          .pinyin {
            font-family: ${ReviewStyles.typography.sans};
            font-size: clamp(0.7rem, 2.2vw, 0.85rem);
            color: ${ReviewStyles.colors.gold};
            font-weight: 700;
            letter-spacing: 0.1px;
            word-break: normal;
            overflow-wrap: anywhere;
            min-width: 0;
          }

          .meaning {
            font-family: ${ReviewStyles.typography.sans};
            font-size: clamp(0.72rem, 2.3vw, 0.9rem);
            color: ${ReviewStyles.colors.text};
            font-weight: 600;
            word-break: normal;
            overflow-wrap: break-word;
            hyphens: auto;
            opacity: 0.85;
            text-align: left;
            line-height: 1.3;
            min-width: 0;
          }

          :host([data-lang="ko"]) .meaning,
          :host([data-lang="ja"]) .meaning {
            word-break: keep-all;
            overflow-wrap: anywhere;
          }

          .audio-trigger {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: rgba(139, 0, 0, 0.03);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(139, 0, 0, 0.05);
            flex-shrink: 0;
          }

          .audio-icon {
            width: 18px;
            height: 18px;
            object-fit: contain;
            opacity: 0.7;
            transition: all 0.2s;
          }

          .compact-card:hover .audio-trigger {
            background: rgba(139, 0, 0, 0.08);
            border-color: rgba(139, 0, 0, 0.15);
          }

          .compact-card:hover .audio-icon {
            opacity: 1;
            transform: scale(1.1);
          }

          .audio-trigger:active {
            transform: scale(0.9);
          }

          @container (max-width: 300px) {
            .compact-card {
              grid-template-columns: auto minmax(0, 1fr) auto;
              gap: 0.3rem 0.65rem;
              padding: 0.65rem 0.8rem;
            }

            .meaning {
              grid-column: 1 / -1;
              padding-top: 0.1rem;
            }
          }
        </style>

        <div class="compact-card" title="${ui.audioTooltip}">
          <div class="word">${this._data.word}</div>
          <div class="pinyin">${this._data.pinyin}</div>
          <div class="meaning">${this._data.meaning}</div>
          <div class="audio-trigger">
            <img src="/redgold/assets/audio-icon-v3.png" class="audio-icon" alt="${ui.playAlt}">
          </div>
          ${this._data.audio ? `<audio id="card-audio" src="${this._data.audio}"></audio>` : ''}
        </div>
      `;

      this.shadowRoot.querySelector('.compact-card')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._data?.audio) {
          const audio = this.shadowRoot?.getElementById('card-audio') as HTMLAudioElement;
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => this.speakFallback());
          }
        } else {
          this.speakFallback();
        }
      });
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          min-width: 0;
        }
        
        .vocab-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          cursor: pointer;
          min-width: 0;
        }

        .is-flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          ${ReviewStyles.glassCard}
          box-sizing: border-box;
          overflow-y: auto;
          scrollbar-width: none;
          min-width: 0;
        }

        .card-face::-webkit-scrollbar {
          display: none;
        }

        .card-face::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%);
          pointer-events: none;
        }

        .card-face-back {
          transform: rotateY(180deg);
          background: rgba(253, 251, 247, 0.9);
        }

        .word {
          font-family: ${ReviewStyles.typography.serif};
          font-size: clamp(3rem, 15vw, 5rem);
          font-weight: 900;
          color: ${ReviewStyles.colors.deepRed};
          margin: 0;
          text-shadow: 0 2px 10px rgba(139, 0, 0, 0.1);
          letter-spacing: 0;
          line-height: 1;
          overflow-wrap: anywhere;
        }

        .pinyin {
          font-family: ${ReviewStyles.typography.sans};
          font-size: clamp(1rem, 5vw, 1.4rem);
          color: ${ReviewStyles.colors.gold};
          font-weight: 700;
          margin-top: 1rem;
          letter-spacing: 1px;
          overflow-wrap: anywhere;
          text-align: center;
        }

        .meaning {
          font-family: ${ReviewStyles.typography.sans};
          font-size: clamp(1.2rem, 6vw, 1.8rem);
          color: ${ReviewStyles.colors.text};
          text-align: center;
          margin-top: 0.5rem;
          font-weight: 600;
          line-height: 1.3;
          word-break: normal;
          overflow-wrap: break-word;
          hyphens: auto;
          max-width: 100%;
        }

        :host([data-lang="ko"]) .meaning,
        :host([data-lang="ja"]) .meaning {
          word-break: keep-all;
          overflow-wrap: anywhere;
        }

        .example {
          font-family: ${ReviewStyles.typography.sans};
          font-size: clamp(0.85rem, 4vw, 1rem);
          color: ${ReviewStyles.colors.muted};
          margin-top: 1rem;
          text-align: center;
          line-height: 1.5;
          padding: 0.8rem;
          background: rgba(139, 0, 0, 0.03);
          border-radius: 12px;
          width: 90%;
          overflow-wrap: anywhere;
        }

        .flip-hint {
          position: absolute;
          bottom: 1.5rem;
          font-family: ${ReviewStyles.typography.sans};
          font-size: 0.7rem;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
        }
      </style>

      <div class="vocab-card-inner ${this._isFlipped ? 'is-flipped' : ''}">
        <div class="card-face card-face-front">
          <h1 class="word">${this._data.word}</h1>
          <div class="flip-hint">${hint.front}</div>
        </div>
        <div class="card-face card-face-back">
          <div class="pinyin">${this._data.pinyin}</div>
          <div class="meaning">${this._data.meaning}</div>
          ${this._data.example ? `<div class="example">${this._data.example}</div>` : ''}
          ${this._data.audio ? `<audio id="card-audio" src="${this._data.audio}"></audio>` : ''}
          <div class="flip-hint">${hint.back}</div>
        </div>
      </div>
    `;
    // The click event is now handled entirely by InteractionManager via onTap
    // to prevent conflicts with pointer capture and double-flipping.
  }

  private speakFallback() {
    if (!this._data) return;
    const utterance = new SpeechSynthesisUtterance(this._data.word);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  }
}

if (!customElements.get('vocab-card')) {
  customElements.define('vocab-card', VocabCardComponent);
}
