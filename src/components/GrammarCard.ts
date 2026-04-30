/**
 * <grammar-card> Web Component
 * Features a dual-layer interface for Formal vs Colloquial comparison.
 */
export class GrammarCard extends HTMLElement {
  private _data: any = null;
  private _isColloquial: boolean = false;

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

  toggleLayer() {
    this._isColloquial = !this._isColloquial;
    this.render();
  }

  render() {
    if (!this._data || !this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1.5rem;
          perspective: 1000px;
        }

        .card {
          position: relative;
          width: 100%;
          min-height: 200px;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          cursor: pointer;
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto;
        }

        .card.is-flipped {
          transform: rotateY(180deg);
        }

        .side {
          grid-area: 1 / 1 / 2 / 2;
          width: 100%;
          height: 100%; /* Keeps sides same height within the grid cell */
          backface-visibility: hidden;
          border-radius: 20px;
          padding: 1.5rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .front {
          background: linear-gradient(135deg, #fff 0%, #fdfbfb 100%);
          color: #333;
          position: relative;
          z-index: 2;
        }

        .back {
          background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%);
          color: #fff;
          transform: rotateY(180deg);
        }

        .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          opacity: 0.8;
          font-weight: 700;
        }

        .back .label { color: #D4AF37; }
        .front .label { color: #8B0000; }

        .point {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          font-family: 'Noto Sans SC', sans-serif;
        }

        .example {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        .explanation {
          font-size: 0.95rem;
          line-height: 1.5;
          opacity: 0.9;
          font-style: italic;
          margin-bottom: 1rem;
        }

        .translation {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.4;
          font-family: 'Inter', sans-serif;
        }

        .back .translation {
          color: rgba(255, 255, 255, 0.8);
        }

        .pattern-box {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 10px;
          padding: 0.75rem;
          margin-bottom: 1rem;
        }

        .pattern-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .pattern-text {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        .nuance {
          font-size: 0.9rem;
          line-height: 1.5;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .pinyin {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
          font-family: 'Inter', sans-serif;
        }

        .back .pinyin {
          color: rgba(255, 255, 255, 0.7);
        }

        .tip {
          margin-top: auto;
          text-align: right;
          font-size: 0.75rem;
          opacity: 0.6;
          font-weight: 500;
          padding-top: 0.5rem;
        }

        .example b {
          color: #8B0000;
          font-weight: 800;
          background: rgba(139, 0, 0, 0.05);
          padding: 0 2px;
          border-radius: 2px;
        }

        .back .example b {
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.15);
        }
      </style>

      <div class="card ${this._isColloquial ? 'is-flipped' : ''}" id="flip-card">
        <div class="side front">
          <div class="label">Textbook Formal</div>
          <div class="point">${this._data.point}</div>
          <div class="example">${this._data.formal_example}</div>
          ${this._data.formal_pinyin ? `<div class="pinyin">${this._data.formal_pinyin}</div>` : ''}
          ${this._data.formal_translation ? `<div class="translation">${this._data.formal_translation}</div>` : ''}
          <div class="explanation">${this._data.explanation}</div>
          <div class="tip">Tap to see colloquial version →</div>
        </div>
        <div class="side back">
          <div class="label">Native Colloquial</div>
          <div class="point">${this._data.point}</div>
          
          ${this._data.colloquial_pattern ? `
            <div class="pattern-box">
              <div class="pattern-label">Colloquial Pattern</div>
              <div class="pattern-text">${this._data.colloquial_pattern}</div>
            </div>
          ` : ''}

          <div class="example">${this._data.colloquial_version}</div>
          ${this._data.colloquial_pinyin ? `<div class="pinyin">${this._data.colloquial_pinyin}</div>` : ''}
          ${this._data.colloquial_translation ? `<div class="translation">${this._data.colloquial_translation}</div>` : ''}
          <div class="nuance">${this._data.nuance}</div>
          <div class="tip">Tap to go back ←</div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('flip-card')?.addEventListener('click', () => this.toggleLayer());
  }
}

customElements.define('grammar-card', GrammarCard);
