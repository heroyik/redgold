/**
 * <key-sentences> Web Component
 * Displays "Golden Sentences" (Mastery) with formal vs colloquial pairings.
 */
export class KeySentences extends HTMLElement {
  private _sentences: any[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set sentences(value: any[]) {
    this._sentences = value || [];
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
          padding: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .mastery-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sentence-group {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(139, 0, 0, 0.1);
        }

        .formal-section {
          padding: 1.5rem;
          background: linear-gradient(to right, #fff, #fff9f9);
          border-bottom: 2px dashed rgba(139, 0, 0, 0.1);
        }

        .colloquial-section {
          padding: 1.5rem;
          background: #8B0000;
          color: #fff;
          position: relative;
        }

        .label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 0.75rem;
          font-weight: 700;
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .formal-section .label {
          background: rgba(139, 0, 0, 0.1);
          color: #8B0000;
        }

        .colloquial-section .label {
          background: rgba(212, 175, 55, 0.2);
          color: #D4AF37;
        }

        .chinese-text {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          font-family: 'Noto Sans SC', sans-serif;
        }

        .pinyin {
          font-size: 1rem;
          margin-bottom: 0.75rem;
          opacity: 0.8;
          font-family: 'Inter', sans-serif;
        }

        .translation {
          font-size: 1rem;
          line-height: 1.5;
          opacity: 0.9;
        }

        .formal-section .pinyin { color: #666; }
        .formal-section .translation { color: #444; font-style: italic; }

        .context-tag {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #999;
          font-style: italic;
        }

        .formal-section .chinese-text b {
          color: #8B0000;
          border-bottom: 2px solid #D4AF37;
        }

        .colloquial-section .chinese-text b {
          color: #D4AF37;
          border-bottom: 2px solid rgba(255, 255, 255, 0.4);
        }
      </style>

      <div class="mastery-container">
        ${this._sentences.length === 0 ? `
          <div class="empty-state">No mastery sentences available for this chapter.</div>
        ` : this._sentences.map(s => `
          <div class="sentence-group">
            <div class="formal-section">
              <div class="label">Golden Sentence</div>
              <div class="chinese-text">${s.sentence}</div>
              <div class="pinyin">${s.pinyin}</div>
              <div class="translation">${s.translation}</div>
            </div>
            <div class="colloquial-section">
              <div class="context-tag">${s.context}</div>
              <div class="label">Living Language</div>
              <div class="chinese-text">${s.colloquial_equivalent}</div>
              <div class="pinyin">${s.colloquial_pinyin}</div>
              <div class="translation">Natural alternative for everyday flow.</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

customElements.define('key-sentences', KeySentences);
