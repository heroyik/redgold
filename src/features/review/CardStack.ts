import { ReviewState, VocabItem } from './ReviewState';
import { VocabCardComponent } from './VocabCard';
import { InteractionManager } from './InteractionManager';
import { ReviewStyles } from './ReviewStyles';

export class CardStackComponent extends HTMLElement {
  private state: ReviewState | null = null;
  private stackContainer: HTMLElement | null = null;
  private _language = 'en';

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

  set language(value: string) {
    this._language = value;
    this.render();
  }

  private getLabels() {
    const labels: Record<string, any> = {
      en: { learned: 'Learned', done: 'Well Done!', sub: "You've mastered this session.", restart: 'Restart Session' },
      ko: { learned: '학습 완료', done: '참 잘했어요!', sub: '이번 세션을 모두 완료했습니다.', restart: '다시 시작' },
      ja: { learned: '学習済み', done: 'お疲れ様でした！', sub: 'このセッションを完了しました。', restart: '再開する' }
    };
    return labels[this._language] || labels.en;
  }

  private render() {
    if (!this.shadowRoot) return;

    const labels = this.getLabels();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          padding: 1rem;
        }

        @media (max-width: 600px) {
          :host {
            padding: 0.25rem 0.25rem;
          }
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          padding: 0;
        }

        .progress-info {
          font-family: ${ReviewStyles.typography.sans};
          font-weight: 900;
          color: ${ReviewStyles.colors.deepRed};
          font-size: 1.25rem;
          letter-spacing: -1px;
        }

        .stats {
          font-family: ${ReviewStyles.typography.sans};
          font-size: 0.7rem;
          color: ${ReviewStyles.colors.gold};
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
          flex-shrink: 1; /* allow shrink if needed */
          background: rgba(218, 165, 32, 0.08);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 600px) {
          .stats {
            font-size: 0.65rem;
            padding: 0.2rem 0.3rem;
            letter-spacing: 0px;
          }
        }


        .nav-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          user-select: none;
        }

        .nav-btn {
          background: rgba(139, 0, 0, 0.05);
          border: 1px solid rgba(139, 0, 0, 0.1);
          color: ${ReviewStyles.colors.deepRed};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0;
        }

        .nav-btn:hover:not(:disabled) {
          background: rgba(139, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .nav-btn:active:not(:disabled) {
          transform: scale(0.9);
        }

        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-btn svg {
          width: 18px;
          height: 18px;
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

        .celebration {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 480px;
          text-align: center;
          animation: celebrationPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          ${ReviewStyles.glassCard}
          border-radius: 32px;
        }

        @keyframes celebrationPop {
          0% { opacity: 0; transform: scale(0.5) translateY(50px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .celebration h2 {
          font-family: ${ReviewStyles.typography.sans};
          color: ${ReviewStyles.colors.deepRed};
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 900;
        }

        .celebration p {
          font-family: ${ReviewStyles.typography.sans};
          color: ${ReviewStyles.colors.muted};
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .restart-btn {
          background: ${ReviewStyles.colors.deepRed};
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-family: ${ReviewStyles.typography.sans};
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
        <div class="nav-controls">
          <button class="nav-btn" id="prev-btn" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div class="progress-info" id="progress-text">0 / 0</div>
          <button class="nav-btn" id="next-btn" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        <div class="stats" id="stats-info">${labels.learned}: 0</div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" id="progress-bar"></div>
      </div>

      <div class="stack-container" id="stack-container"></div>

      <div class="celebration" id="celebration">
        <h2>🎉 ${labels.done}</h2>
        <p>${labels.sub}</p>
        <button class="restart-btn" id="restart-btn">${labels.restart}</button>
      </div>
    `;

    this.stackContainer = this.shadowRoot.getElementById('stack-container');
    
    this.shadowRoot.getElementById('prev-btn')?.addEventListener('click', () => {
      this.state?.previous();
    });
    
    this.shadowRoot.getElementById('next-btn')?.addEventListener('click', () => {
      this.state?.nextManual();
    });

    this.shadowRoot.getElementById('restart-btn')?.addEventListener('click', () => {
      this.state?.reset();
    });
    this.update();
  }

  private update() {
    if (!this.state || !this.shadowRoot || !this.stackContainer) return;

    const { total, current, learned } = this.state.stats;
    const isComplete = this.state.currentItem === null;
    const labels = this.getLabels();

    const progressText = this.shadowRoot.getElementById('progress-text');
    const progressBar = this.shadowRoot.getElementById('progress-bar');
    const statsInfo = this.shadowRoot.getElementById('stats-info');
    const celebration = this.shadowRoot.getElementById('celebration');
    const prevBtn = this.shadowRoot.getElementById('prev-btn') as HTMLButtonElement;
    const nextBtn = this.shadowRoot.getElementById('next-btn') as HTMLButtonElement;

    if (progressText) progressText.textContent = `${Math.min(current, total)} / ${total}`;
    if (progressBar) progressBar.style.width = `${this.state.progress}%`;
    if (statsInfo) statsInfo.textContent = `${labels.learned}: ${learned}`;

    if (prevBtn) prevBtn.disabled = current <= 1;
    if (nextBtn) nextBtn.disabled = current >= total || isComplete;

    if (isComplete) {
      this.stackContainer.style.display = 'none';
      if (celebration) celebration.style.display = 'flex';
      return;
    } else {
      this.stackContainer.style.display = 'block';
      if (celebration) celebration.style.display = 'none';
    }

    this.refreshStack();
  }

  private refreshStack() {
    if (!this.state || !this.stackContainer) return;

    this.stackContainer.innerHTML = '';
    
    const itemsToShow = this.state.stats.total - this.state.stats.current + 1;
    const limit = Math.min(itemsToShow, 3);

    for (let i = limit - 1; i >= 0; i--) {
      const idx = this.state.stats.current - 1 + i;
      const item = this.state.items[idx];
      if (!item) continue;

      const wrapper = document.createElement('div');
      wrapper.className = 'card-wrapper';
      
      const scale = 1 - (i * 0.05);
      const translateY = i * 15;
      const opacity = 1 - (i * 0.3);
      wrapper.style.transform = `translateY(${translateY}px) scale(${scale})`;
      wrapper.style.opacity = `${opacity}`;
      wrapper.style.zIndex = `${10 - i}`;

      const card = document.createElement('vocab-card') as VocabCardComponent;
      card.data = item;
      card.language = this._language;
      wrapper.appendChild(card);
      this.stackContainer.appendChild(wrapper);

      if (i === 0) {
        new InteractionManager(
          wrapper, 
          (result) => {
            if (result.direction === 'right') {
              this.state?.markAsLearned();
            } else {
              this.state?.markAsNeedReview();
            }
          }
        );
      }
    }
  }
}

if (!customElements.get('card-stack')) {
  customElements.define('card-stack', CardStackComponent);
}
