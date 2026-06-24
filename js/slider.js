class ComparisonSlider {
  constructor(container) {
    if (!container) return;
    this.container = container;
    this.handle = container.querySelector('.slider-handle');
    this.afterImage = container.querySelector('.after-image');
    this.isDragging = false;
    this.position = 50;
    this.init();
  }

  init() {
    this.handle.addEventListener('pointerdown', (e) => this.startDrag(e));
    document.addEventListener('pointermove', (e) => this.drag(e));
    document.addEventListener('pointerup', () => this.stopDrag());
    this.container.addEventListener('keydown', (e) => this.keyboard(e));
    this.updatePosition(this.position);
  }

  startDrag(e) {
    this.isDragging = true;
    this.handle.setPointerCapture(e.pointerId);
  }

  drag(e) {
    if (!this.isDragging) return;
    const rect = this.container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    this.updatePosition(Math.max(0, Math.min(100, x)));
  }

  stopDrag() {
    this.isDragging = false;
  }

  keyboard(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const step = e.key === 'ArrowLeft' ? -5 : 5;
      this.updatePosition(Math.max(0, Math.min(100, this.position + step)));
    }
  }

  updatePosition(pos) {
    this.position = pos;
    this.handle.style.left = pos + '%';
    this.afterImage.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    this.container.setAttribute('aria-valuenow', Math.round(pos));
  }
}
