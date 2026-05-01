import { sanitizeHTML } from '../utils/security';
import { getUiCopy } from '../utils/uiCopy';
import type { AppLanguage } from '../utils/lessonTranslations';

export class GrammarCard extends HTMLElement {
  private _data: any = null;
  private _isColloquial: boolean = false;
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
    const ui = getUiCopy(this._language);

    this.shadowRoot.innerHTML = `
      <style>
        /* ... styles preserved ... */
        :host {
          display: block;
          margin-bottom: 1.5rem;
          perspective: 1200px;
        }

        .card {
          position: relative;
          width: 100%;
          min-height: 220px;
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          cursor: pointer;
          display: grid;
        }

        .card.is-flipped {
          transform: rotateY(180deg);
        }

        .side {
          grid-area: 1 / 1 / 2 / 2;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 24px;
          padding: 1.75rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-premium, 0 10px 30px -10px rgba(0, 0, 0, 0.1));
          border: 1px solid rgba(139, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .front {
          background: #ffffff;
          color: #333;
          z-index: 2;
        }

        .back {
          background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%);
          color: #fff;
          transform: rotateY(180deg);
        }

        .label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 0.75rem;
          opacity: 0.8;
          font-weight: 800;
        }

        .back .label { color: #DAA520; }
        .front .label { color: #8B0000; }

        .point {
          font-size: 1.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          font-family: 'Outfit', 'Noto Sans SC', sans-serif;
          color: inherit;
        }

        .example {
          font-size: 1.15rem;
          line-height: 1.5;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .explanation {
          font-size: 0.9rem;
          line-height: 1.5;
          opacity: 0.8;
          font-style: italic;
          margin-bottom: 1.25rem;
          color: #555;
        }

        .back .explanation { color: rgba(255, 255, 255, 0.8); }

        .translation {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.4;
          font-weight: 400;
        }

        .back .translation {
          color: rgba(255, 255, 255, 0.8);
        }

        .pattern-box {
          background: rgba(218, 165, 32, 0.15);
          border: 1px solid rgba(218, 165, 32, 0.3);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.25rem;
        }

        .pattern-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: #DAA520;
          margin-bottom: 0.35rem;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .pattern-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }

        .nuance {
          font-size: 0.9rem;
          line-height: 1.5;
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          color: #DAA520;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .pinyin {
          font-size: 0.85rem;
          color: #8B0000;
          margin-bottom: 1rem;
          font-weight: 600;
          opacity: 0.7;
        }

        .back .pinyin {
          color: rgba(255, 255, 255, 0.6);
        }

        .tip {
          margin-top: auto;
          text-align: right;
          font-size: 0.7rem;
          opacity: 0.5;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .example b {
          color: #8B0000;
          font-weight: 900;
          position: relative;
        }

        .back .example b {
          color: #DAA520;
        }
      </style>

      <div class="card ${this._isColloquial ? 'is-flipped' : ''}" id="flip-card">
        <div class="side front">
          <div class="label">${ui.formalLabel}</div>
          <div class="point">${sanitizeHTML(this._data.point)}</div>
          <div class="example">${sanitizeHTML(this._data.formal_example)}</div>
          ${this._data.formal_pinyin ? `<div class="pinyin">${sanitizeHTML(this._data.formal_pinyin)}</div>` : ''}
          ${this._data.formal_translation ? `<div class="translation">${sanitizeHTML(this._data.formal_translation)}</div>` : ''}
          <div class="explanation">${sanitizeHTML(this._data.explanation)}</div>
          <div class="tip">${ui.tipToColloquial}</div>
        </div>
        <div class="side back">
          <div class="label">${ui.colloquialLabel}</div>
          <div class="point">${sanitizeHTML(this._data.point)}</div>
          
          ${this._data.colloquial_pattern ? `
            <div class="pattern-box">
              <div class="pattern-label">${ui.colloquialPattern}</div>
              <div class="pattern-text">${sanitizeHTML(this._data.colloquial_pattern)}</div>
            </div>
          ` : ''}

          <div class="example">${sanitizeHTML(this._data.colloquial_version)}</div>
          ${this._data.colloquial_pinyin ? `<div class="pinyin">${sanitizeHTML(this._data.colloquial_pinyin)}</div>` : ''}
          ${this._data.colloquial_translation ? `<div class="translation">${sanitizeHTML(this._data.colloquial_translation)}</div>` : ''}
          <div class="nuance">${sanitizeHTML(this._data.nuance)}</div>
          <div class="tip">${ui.tipToBack}</div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('flip-card')?.addEventListener('click', () => this.toggleLayer());
  }
}

customElements.define('grammar-card', GrammarCard);
