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
          padding: 0.5rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .mastery-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          padding-bottom: 3rem;
        }

        .sentence-group {
          background: #fff;
          border-radius: var(--border-radius-xl, 32px);
          overflow: hidden;
          box-shadow: var(--shadow-premium, 0 10px 30px -10px rgba(0, 0, 0, 0.1));
          border: 1px solid var(--glass-border, rgba(139, 0, 0, 0.1));
          animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .formal-section {
          padding: 2rem 1.75rem;
          background: linear-gradient(135deg, #fff 0%, #fffafa 100%);
          border-bottom: 1px dashed rgba(139, 0, 0, 0.1);
        }

        .colloquial-section {
          padding: 2.25rem 1.75rem;
          background: var(--primary-red, #8B0000);
          color: #fff;
          position: relative;
          background-image: radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 50%);
        }

        .label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1rem;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Outfit', sans-serif;
        }

        .formal-section .label {
          color: var(--primary-red, #8B0000);
          opacity: 0.6;
        }

        .colloquial-section .label {
          color: var(--accent-gold, #DAA520);
        }

        .chinese-text {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          font-family: 'Noto Sans SC', sans-serif;
          letter-spacing: -0.01em;
        }

        .pinyin {
          font-size: 0.95rem;
          margin-bottom: 1rem;
          opacity: 0.6;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
        }

        .translation {
          font-size: 1rem;
          line-height: 1.6;
          opacity: 0.85;
          font-weight: 400;
        }

        .formal-section .pinyin { color: #555; }
        .formal-section .translation { color: #333; }

        .context-tag {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 6px 12px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          backdrop-filter: blur(4px);
        }

        .empty-state {
          text-align: center;
          padding: 6rem 2rem;
          color: #999;
          font-style: italic;
          font-size: 1.1rem;
        }

        .chinese-text b {
          position: relative;
          z-index: 1;
        }

        .formal-section .chinese-text b {
          color: var(--primary-red, #8B0000);
        }
        
        .formal-section .chinese-text b::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          width: 100%;
          height: 8px;
          background: rgba(218, 165, 32, 0.2);
          z-index: -1;
        }

        .colloquial-section .chinese-text b {
          color: var(--accent-gold, #DAA520);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .chinese-text { font-size: 1.35rem; }
          .sentence-group { border-radius: 24px; }
          .formal-section, .colloquial-section { padding: 1.5rem; }
        }
      </style>

      <div class="mastery-container">
        ${this._sentences.length === 0 ? `
          <div class="empty-state">No mastery sentences available for this chapter.</div>
        ` : this._sentences.map((s, index) => `
          <div class="sentence-group" style="animation-delay: ${index * 0.15}s">
            <div class="formal-section">
              <div class="label">✨ Standard Han</div>
              <div class="chinese-text">${s.sentence}</div>
              <div class="pinyin">${s.pinyin}</div>
              <div class="translation">${s.translation}</div>
            </div>
            <div class="colloquial-section">
              <div class="context-tag">${s.context}</div>
              <div class="label">🔥 Living Language</div>
              <div class="chinese-text">${s.colloquial_equivalent}</div>
              <div class="pinyin">${s.colloquial_pinyin}</div>
              <div class="translation">Perfect for natural, flowing conversations.</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

customElements.define('key-sentences', KeySentences);
