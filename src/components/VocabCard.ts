/**
 * <vocab-card> Web Component
 * Displays a single vocabulary word with its Pinyin and meaning.
 */
export class VocabCard extends HTMLElement {
  private _word: string = '';
  private _pinyin: string = '';
  private _meaning: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(value: { word: string; pinyin: string; meaning: string }) {
    this._word = value.word;
    this._pinyin = value.pinyin;
    this._meaning = value.meaning;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1.25rem;
          width: 100%;
        }

        .card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: var(--border-radius-lg, 20px);
          padding: 1.5rem;
          box-shadow: var(--shadow-soft, 0 4px 12px rgba(0, 0, 0, 0.05));
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(139, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #8B0000, #DAA520);
          opacity: 0.8;
        }

        .card:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.9);
        }

        .word-group {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .word {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1a1a1a;
          font-family: 'Noto Sans SC', sans-serif;
          letter-spacing: -0.5px;
        }

        .pinyin {
          font-size: 0.85rem;
          color: #8B0000;
          font-weight: 700;
          letter-spacing: 0.5px;
          opacity: 0.8;
        }

        .meaning {
          font-size: 1rem;
          color: #555;
          max-width: 55%;
          text-align: right;
          font-weight: 500;
          line-height: 1.3;
        }

        @media (max-width: 480px) {
          .word { font-size: 1.5rem; }
          .meaning { font-size: 0.9rem; }
          .card { padding: 1.25rem; }
        }
      </style>
      <div class="card animate-scale">
        <div class="word-group">
          <span class="pinyin">${this._pinyin}</span>
          <span class="word">${this._word}</span>
        </div>
        <div class="meaning">${this._meaning}</div>
      </div>
    `;
  }
}

customElements.define('vocab-card', VocabCard);
