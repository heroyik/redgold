
import { ReviewState, VocabItem } from './ReviewState';
import { VocabCardComponent } from './VocabCard';
import { InteractionManager } from './InteractionManager';

export class CardStackComponent extends HTMLElement {
  private state: ReviewState | null = null;
  private stackContainer: HTMLElement | null = null;
  private progressInfo: HTMLElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set vocabulary(value: VocabItem[]) {
    this.state = new ReviewState(value);
    this.state.subscribe(this.update.bind(this));
    this.render();
  }

  set items(value: VocabItem[]) {
    this.vocabulary = value;
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          padding: 1rem;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 0.5rem;
          padding: 0 0.5rem;
        }

        .progress-info {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          color: #8B0000;
          font-size: 1.5rem;
          letter-spacing: -1px;
        }

        .stats {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          color: #DAA520;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .progress-bar-container {
          width: 100%;
          height: 6px;
          background: rgba(139, 0, 0, 0.05);
          border-radius: 3px;
          margin-bottom: 4rem;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #DAA520, #FFD700);
          width: 0%;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-radius: 3px;
        }

        .stack-container {
          position: relative;
          width: 100%;
          height: 480px;
          perspective: 1500px;
        }

        .card-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform, opacity;
        }

        /* Celebration Screen */
        .celebration {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 480px;
          text-align: center;
          animation: celebrationPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 32px;
          border: 1px solid rgba(218, 165, 32, 0.2);
        }

        @keyframes celebrationPop {
          0% { opacity: 0; transform: scale(0.5) translateY(50px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .celebration h2 {
          font-family: 'Outfit', sans-serif;
          color: #8B0000;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 900;
        }

        .celebration p {
          font-family: 'Outfit', sans-serif;
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .restart-btn {
          background: #8B0000;
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 20px rgba(139, 0, 0, 0.2);
        }

        .restart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(139, 0, 0, 0.3);
        }
      </style>

      <div class="review-header">
        <div class="progress-info" id="progress-text">0 / 0</div>
        <div class="stats" id="stats-info">Learned: 0</div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" id="progress-bar"></div>
      </div>

      <div class="stack-container" id="stack-container">
        <!-- Cards will be injected here -->
      </div>

      <div class="celebration" id="celebration">
        <h2>🎉 Well Done!</h2>
        <p>You've mastered this session.</p>
        <button class="restart-btn" id="restart-btn">Restart Session</button>
      </div>
    `;

    this.stackContainer = this.shadowRoot.getElementById('stack-container');
    this.shadowRoot.getElementById('restart-btn')?.addEventListener('click', () => {
      this.state?.reset();
    });
    this.update();
  }

  private update() {
    if (!this.state || !this.shadowRoot || !this.stackContainer) return;

    const { total, current, learned } = this.state.stats;
    const isComplete = this.state.currentItem === null;

    // Update progress UI
    const progressText = this.shadowRoot.getElementById('progress-text');
    const progressBar = this.shadowRoot.getElementById('progress-bar');
    const statsInfo = this.shadowRoot.getElementById('stats-info');

    if (progressText) progressText.textContent = `${Math.min(current, total)} / ${total}`;
    if (progressBar) progressBar.style.width = `${this.state.progress}%`;
    if (statsInfo) statsInfo.textContent = `Learned: ${learned}`;

    if (isComplete) {
      this.stackContainer.style.display = 'none';
      const celebration = this.shadowRoot.getElementById('celebration');
      if (celebration) celebration.style.display = 'flex';
      return;
    }

    // Refresh Stack
    this.refreshStack();
  }

  private refreshStack() {
    if (!this.state || !this.stackContainer) return;

    this.stackContainer.innerHTML = '';
    
    // We only need to render the top 2-3 cards for performance and visual depth
    const itemsToShow = this.state.stats.total - this.state.stats.current + 1;
    const limit = Math.min(itemsToShow, 3);

    for (let i = limit - 1; i >= 0; i--) {
      const idx = this.state.stats.current - 1 + i;
      const item = this.state.items[idx];
      if (!item) continue;

      const wrapper = document.createElement('div');
      wrapper.className = 'card-wrapper';
      
      // Apply stack visual effects
      const scale = 1 - (i * 0.05);
      const translateY = i * 15;
      const opacity = 1 - (i * 0.3);
      wrapper.style.transform = `translateY(${translateY}px) scale(${scale})`;
      wrapper.style.opacity = `${opacity}`;
      wrapper.style.zIndex = `${10 - i}`;

      const card = document.createElement('vocab-card') as VocabCardComponent;
      card.data = item;
      wrapper.appendChild(card);
      this.stackContainer.appendChild(wrapper);

      // Only the top card is interactive
      if (i === 0) {
        new InteractionManager(wrapper, (result) => {
          if (result.direction === 'right') {
            this.state?.markAsLearned();
          } else {
            this.state?.markAsNeedReview();
          }
        });
      }
    }
  }
}

if (!customElements.get('card-stack')) {
  customElements.define('card-stack', CardStackComponent);
}
