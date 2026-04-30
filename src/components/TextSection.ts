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
          display: block;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(139, 0, 0, 0.1);
          font-family: 'Outfit', sans-serif;
        }

        .dialogue {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .line {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .speaker {
          font-weight: 800;
          font-size: 0.7rem;
          color: #8B0000;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          opacity: 0.8;
          padding-left: 0.5rem;
        }

        .content {
          font-size: 1.15rem;
          line-height: 1.5;
          color: #1a1a1a;
          font-family: 'Noto Sans SC', sans-serif;
          background: #fff;
          padding: 1rem 1.25rem;
          border-radius: 20px;
          border-top-left-radius: 4px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          position: relative;
          border: 1px solid rgba(0,0,0,0.02);
        }

        .line:nth-child(even) .content {
          background: #fdfaf0;
          border-top-left-radius: 20px;
          border-top-right-radius: 4px;
        }

        .line:nth-child(even) .speaker {
          text-align: right;
          padding-left: 0;
          padding-right: 0.5rem;
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

        .main-text b {
          color: #8B0000;
          font-weight: 900;
          background: rgba(139, 0, 0, 0.05);
          padding: 0 2px;
          border-radius: 4px;
        }
      </style>

      <div class="text-container">
        <h3>课文 ${this._data.id}: ${this._data.title}</h3>
        <div class="dialogue">
          ${this._data.content.map((line: any) => `
            <div class="line">
              <span class="speaker">${line.speaker}</span>
              <div class="content">
                <div class="main-text">${line.text}</div>
                ${line.pinyin ? `<div class="pinyin">${line.pinyin}</div>` : ''}
                ${line.translation ? `<div class="translation">${line.translation}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('text-section', TextSection);
