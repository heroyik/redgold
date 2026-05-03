
import { VocabItem } from './ReviewState';

export class VocabCardComponent extends HTMLElement {
  private _data: VocabItem | null = null;
  private _isFlipped = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(value: VocabItem) {
    this._data = value;
    this.render();
  }

  toggleFlip() {
    this._isFlipped = !this._isFlipped;
    const inner = this.shadowRoot?.querySelector('.vocab-card-inner');
    if (inner) {
      if (this._isFlipped) {
        inner.classList.add('is-flipped');
      } else {
        inner.classList.remove('is-flipped');
      }
    }
  }

  render() {
    if (!this._data || !this.shadowRoot) return;

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
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          border: 1px solid rgba(139, 0, 0, 0.1);
          box-sizing: border-box;
          overflow: hidden;
        }

        .card-face::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%);
          pointer-events: none;
        }

        .card-face-back {
          transform: rotateY(180deg);
          background: rgba(253, 251, 247, 0.9);
        }

        .word {
          font-family: "Noto Serif SC", serif;
          font-size: 5rem;
          font-weight: 900;
          color: #8B0000;
          margin: 0;
          text-shadow: 0 2px 10px rgba(139, 0, 0, 0.1);
          letter-spacing: -2px;
        }

        .pinyin {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          color: #DAA520;
          font-weight: 700;
          margin-top: 1.5rem;
          letter-spacing: 1px;
        }

        .meaning {
          font-family: 'Outfit', sans-serif;
          font-size: 1.8rem;
          color: #1a1a1a;
          text-align: center;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .example {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          color: #555;
          margin-top: 2rem;
          text-align: center;
          line-height: 1.6;
          padding: 0 1.5rem;
          background: rgba(139, 0, 0, 0.03);
          border-radius: 12px;
          padding: 0.8rem;
        }

        .flip-hint {
          position: absolute;
          bottom: 1.5rem;
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
          <div class="flip-hint">Tap to flip</div>
        </div>
        <div class="card-face card-face-back">
          <div class="pinyin">${this._data.pinyin}</div>
          <div class="meaning">${this._data.meaning}</div>
          ${this._data.example ? `<div class="example">${this._data.example}</div>` : ''}
          ${this._data.audio ? `<audio id="card-audio" src="${this._data.audio}"></audio>` : ''}
          <div class="flip-hint">Tap to see word</div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.vocab-card-inner')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFlip();
      
      // Play audio when revealing meaning
      if (this._isFlipped && this._data?.audio) {
        const audio = this.shadowRoot?.getElementById('card-audio') as HTMLAudioElement;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(err => console.log('Audio play failed:', err));
        }
      }
    });
  }
}

if (!customElements.get('vocab-card')) {
  customElements.define('vocab-card', VocabCardComponent);
}
