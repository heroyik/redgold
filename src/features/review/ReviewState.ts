
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
  private originalItems: VocabItem[];
  private data: ReviewStateData;
  private listeners: (() => void)[] = [];

  get items(): VocabItem[] {
    return this.data.items;
  }

  constructor(items: VocabItem[]) {
    this.originalItems = [...items];
    this.data = {
      items: [...items],
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
    // Move the current item to the end of the items list so it appears again later
    const currentItem = this.data.items[this.data.currentIndex];
    if (currentItem) {
      // We don't actually remove it, just push a copy to the end
      // or we can just adjust the indexing. 
      // For a simple implementation: append it to the end.
      this.data.items.push({ ...currentItem });
    }
    this.next();
  }

  reset() {
    this.data = {
      items: [...this.originalItems],
      currentIndex: 0,
      learnedCount: 0,
      needReviewCount: 0,
      isComplete: false
    };
    this.notify();
  }

  previous() {
    if (this.data.currentIndex > 0) {
      this.data.currentIndex--;
      this.data.isComplete = false;
      this.notify();
    }
  }

  nextManual() {
    if (this.data.currentIndex < this.data.items.length - 1) {
      this.data.currentIndex++;
      this.notify();
    }
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
