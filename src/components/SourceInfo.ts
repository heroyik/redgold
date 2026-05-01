/**
 * <source-info> Web Component
 * Displays textbook source information with premium aesthetics.
 */
export class SourceInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
          margin-top: 4rem;
          margin-bottom: 4rem;
          padding: 0 1rem;
        }

        .source-card {
          background: linear-gradient(135deg, rgba(139, 0, 0, 0.03), rgba(212, 175, 55, 0.05));
          border-radius: 32px;
          border: 1px solid rgba(139, 0, 0, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(10px);
        }

        @media (min-width: 768px) {
          .source-card {
            flex-direction: row;
            align-items: center;
          }
        }

        .image-container {
          flex: 1;
          min-height: 250px;
          display: flex;
          gap: 10px;
          padding: 1.5rem;
          background: rgba(139, 0, 0, 0.02);
          align-items: center;
          justify-content: center;
        }

        .book-img {
          width: 45%;
          height: auto;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .book-img:hover {
          transform: scale(1.05) rotate(2deg);
        }

        .content {
          flex: 1.5;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .badge {
          display: inline-flex;
          padding: 6px 14px;
          background: rgba(139, 0, 0, 0.1);
          color: #8B0000;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          width: fit-content;
        }

        h2 {
          margin: 0;
          font-size: 1.75rem;
          color: #1a1a1a;
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          line-height: 1.2;
        }

        p {
          margin: 0;
          color: #666;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .publisher {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: #8B0000;
          font-size: 0.85rem;
        }

        .cta-button {
          margin-top: 0.5rem;
          padding: 14px 28px;
          background: #8B0000;
          color: white;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 0.9rem;
          width: fit-content;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(139, 0, 0, 0.2);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 0, 0, 0.3);
          background: #a00000;
        }

        .cta-button svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }
      </style>

      <div class="source-card">
        <div class="image-container">
          <img src="images/hsk4_upper.jpg" class="book-img" alt="HSK 4 Standard Course Upper">
          <img src="images/hsk4_lower.jpg" class="book-img" alt="HSK 4 Standard Course Lower">
        </div>
        <div class="content">
          <div class="badge">Official Reference</div>
          <h2>HSK Standard Course 4</h2>
          <p>
            Authorized by Hanban and developed by <strong>BLCUP</strong> & <strong>CTI</strong>. 
            This app follows the scientific design and familiar topics of the official Level 4 curriculum, 
            bridging formal test patterns with real-world living language.
          </p>
          <div class="publisher">
            <span>Beijing Language and Culture University Press</span>
          </div>
          <a href="http://www.blcup.com/EnSeriesBook/index/8" target="_blank" class="cta-button">
            <span>Official BLCUP Store</span>
            <svg viewBox="0 0 24 24">
              <path d="M14 3h7v7h-2V6.41l-9.29 9.29-1.42-1.42L17.59 5H14V3zM19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/>
            </svg>
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('source-info', SourceInfo);
