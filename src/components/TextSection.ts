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
          margin-bottom: 2rem;
          width: 100%;
        }

        .text-container {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid rgba(139, 0, 0, 0.1);
        }

        h3 {
          margin-top: 0;
          color: #8B0000;
          font-size: 1.1rem;
          border-bottom: 2px solid #D4AF37;
          display: inline-block;
          margin-bottom: 1.5rem;
          padding-bottom: 0.25rem;
        }

        .dialogue {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .line {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .speaker {
          font-weight: 800;
          font-size: 0.85rem;
          color: #8B0000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .content {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #222;
          font-family: 'Noto Sans SC', sans-serif;
          background: #fff;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border-bottom-left-radius: 2px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          position: relative;
        }

        .line:nth-child(even) .content {
          background: #fffcf0;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 2px;
        }

        .line:nth-child(even) .speaker {
          text-align: right;
        }

        .pinyin {
          font-size: 0.85rem;
          color: #888;
          margin-top: 0.25rem;
          font-style: italic;
        }

        .translation {
          font-size: 0.9rem;
          color: #555;
          margin-top: 0.25rem;
          line-height: 1.4;
        }

        .main-text b {
          color: #8B0000;
          font-weight: 800;
          border-bottom: 2px solid rgba(212, 175, 55, 0.4);
          padding: 0 2px;
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
