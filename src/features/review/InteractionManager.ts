
export interface SwipeResult {
  direction: 'left' | 'right';
  element: HTMLElement;
}

export class InteractionManager {
  private startX: number = 0;
  private startY: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;
  private isDragging: boolean = false;
  private threshold: number = 100; // Swipe threshold in pixels

  constructor(
    private element: HTMLElement,
    private onSwipe: (result: SwipeResult) => void,
    private onTap?: () => void,
    private onDrag?: (x: number, y: number) => void
  ) {
    this.init();
  }

  private init() {
    this.element.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    window.addEventListener('pointermove', this.handlePointerMove.bind(this));
    window.addEventListener('pointerup', this.handlePointerUp.bind(this));
    window.addEventListener('pointercancel', this.handlePointerUp.bind(this));
  }

  private startTime: number = 0;
  private velocityX: number = 0;

  private handlePointerDown(e: PointerEvent) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startTime = Date.now();
    this.velocityX = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.element.style.transition = 'none';
    this.element.setPointerCapture(e.pointerId);
  }

  private handlePointerMove(e: PointerEvent) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.startX;
    const deltaTime = Math.max(1, Date.now() - this.startTime);
    
    this.currentX = deltaX;
    this.currentY = e.clientY - this.startY;
    this.velocityX = deltaX / deltaTime; // px/ms

    const rotation = this.currentX * 0.08;
    this.element.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${rotation}deg)`;

    if (this.onDrag) {
      this.onDrag(this.currentX, this.currentY);
    }
  }

  private handlePointerUp(e: PointerEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.element.releasePointerCapture(e.pointerId);

    // Trigger swipe if past distance threshold OR high enough velocity (flick)
    const isHighVelocity = Math.abs(this.velocityX) > 0.5;
    const isPastThreshold = Math.abs(this.currentX) > this.threshold;

    if (isPastThreshold || isHighVelocity) {
      // Safety check: if they move left but flick right, go by velocity
      const finalDirection = (Math.abs(this.velocityX) > 0.3) 
        ? (this.velocityX > 0 ? 'right' : 'left')
        : (this.currentX > 0 ? 'right' : 'left');

      this.completeSwipe(finalDirection);
    } else {
      // Detect tap
      const moveDistance = Math.sqrt(this.currentX ** 2 + this.currentY ** 2);
      if (moveDistance < 10 && this.onTap) {
        this.onTap();
      }
      this.resetPosition();
    }
  }

  private completeSwipe(direction: 'left' | 'right') {
    const exitX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    this.element.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    this.element.style.transform = `translate(${exitX}px, ${this.currentY}px) rotate(${exitX * 0.1}deg)`;
    this.element.style.opacity = '0';

    setTimeout(() => {
      this.onSwipe({ direction, element: this.element });
    }, 400);
  }

  private resetPosition() {
    this.element.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // Spring back
    this.element.style.transform = `translate(0, 0) rotate(0deg)`;
    this.currentX = 0;
    this.currentY = 0;
  }

  destroy() {
    this.element.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
  }
}
