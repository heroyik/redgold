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
          margin-bottom: 1rem;
          width: 100%;
        }

        .card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border-left: 4px solid #8B0000;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.5);
          border-right: 1px solid rgba(255, 255, 255, 0.3);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(139, 0, 0, 0.1);
        }

        .word-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .word {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          font-family: 'Noto Sans SC', sans-serif;
        }

        .pinyin {
          font-size: 0.9rem;
          color: #8B0000;
          font-weight: 500;
          font-style: italic;
        }

        .meaning {
          font-size: 1rem;
          color: #444;
          max-width: 50%;
          text-align: right;
        }

        @media (max-width: 480px) {
          .word { font-size: 1.25rem; }
          .meaning { font-size: 0.9rem; }
        }
      </style>
      <div class="card">
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
