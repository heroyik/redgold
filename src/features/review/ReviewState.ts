
export interface VocabItem {
  id: string;
  word: string;
  pinyin: string;
  meaning: string;
  example?: string;
  audio?: string;
}

export type ReviewStatus = 'none' | 'learned' | 'need-review';

export interface ReviewStateData {
  items: VocabItem[];
  currentIndex: number;
  learnedCount: number;
  needReviewCount: number;
  isComplete: boolean;
}

export class ReviewState {
  private data: ReviewStateData;
  private listeners: (() => void)[] = [];

  get items(): VocabItem[] {
    return this.data.items;
  }

  constructor(items: VocabItem[]) {
    this.data = {
      items,
      currentIndex: 0,
      learnedCount: 0,
      needReviewCount: 0,
      isComplete: false
    };
  }

  // Getters
  get currentItem(): VocabItem | null {
    if (this.data.isComplete || this.data.currentIndex >= this.data.items.length) {
      return null;
    }
    return this.data.items[this.data.currentIndex];
  }

  get progress(): number {
    return (this.data.currentIndex / this.data.items.length) * 100;
  }

  get stats() {
    return {
      total: this.data.items.length,
      current: this.data.currentIndex + 1,
      learned: this.data.learnedCount,
      needReview: this.data.needReviewCount
    };
  }

  // Actions
  markAsLearned() {
    this.data.learnedCount++;
    this.next();
  }

  markAsNeedReview() {
    this.data.needReviewCount++;
    // In a stack interaction, we might want to put this card back to the end
    // For now, just move to next to keep it simple
    this.next();
  }

  private next() {
    this.data.currentIndex++;
    if (this.data.currentIndex >= this.data.items.length) {
      this.data.isComplete = true;
    }
    this.notify();
  }

  // Listener pattern for UI updates
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}
