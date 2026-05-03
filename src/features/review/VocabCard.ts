import { VocabItem } from './ReviewState';
import { ReviewStyles } from './ReviewStyles';

export class VocabCardComponent extends HTMLElement {
  private _data: VocabItem | null = null;
  private _isFlipped = false;
  private _language = 'en';

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
    this.render();
  }

  toggleFlip() {
    this._isFlipped = !this._isFlipped;
    const inner = this.shadowRoot?.querySelector('.vocab-card-inner');
    if (inner) {
      inner.classList.toggle('is-flipped', this._isFlipped);
    }
  }

  private getHint() {
    const hints: Record<string, { front: string; back: string }> = {
      en: { front: 'Tap to flip', back: 'Tap to see word' },
      ko: { front: '눌러서 뒤집기', back: '다시 단어 보기' },
      ja: { front: 'タップで裏返す', back: '単語を再確認' }
    };
    return hints[this._language] || hints.en;
  }

  render() {
    if (!this._data || !this.shadowRoot) return;

    const hint = this.getHint();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        
        .vocab-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          cursor: pointer;
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
          padding: 2rem;
          ${ReviewStyles.glassCard}
          box-sizing: border-box;
          overflow: hidden;
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
          font-size: 5rem;
          font-weight: 900;
          color: ${ReviewStyles.colors.deepRed};
          margin: 0;
          text-shadow: 0 2px 10px rgba(139, 0, 0, 0.1);
          letter-spacing: -2px;
        }

        .pinyin {
          font-family: ${ReviewStyles.typography.sans};
          font-size: 1.4rem;
          color: ${ReviewStyles.colors.gold};
          font-weight: 700;
          margin-top: 1.5rem;
          letter-spacing: 1px;
        }

        .meaning {
          font-family: ${ReviewStyles.typography.sans};
          font-size: 1.8rem;
          color: ${ReviewStyles.colors.text};
          text-align: center;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .example {
          font-family: ${ReviewStyles.typography.sans};
          font-size: 1rem;
          color: ${ReviewStyles.colors.muted};
          margin-top: 2rem;
          text-align: center;
          line-height: 1.6;
          padding: 0.8rem;
          background: rgba(139, 0, 0, 0.03);
          border-radius: 12px;
          width: 80%;
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

    this.shadowRoot.querySelector('.vocab-card-inner')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFlip();
      
      if (this._isFlipped && this._data?.audio) {
        const audio = this.shadowRoot?.getElementById('card-audio') as HTMLAudioElement;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      }
    });
  }
}

if (!customElements.get('vocab-card')) {
  customElements.define('vocab-card', VocabCardComponent);
}
