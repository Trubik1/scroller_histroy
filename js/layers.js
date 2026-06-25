class Layers {
  constructor() {
    this.tabs = document.querySelectorAll('.layer-tab');
    this.panels = document.querySelectorAll('.layer-panel');
    if (!this.tabs.length || !this.panels.length) return;
    this.init();
    this.initArtifact();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTo(tab.dataset.layer));
    });
  }

  switchTo(layerId) {
    this.tabs.forEach(tab => {
      const isActive = tab.dataset.layer === layerId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });
    this.panels.forEach(panel => {
      const isActive = panel.id === `layer-${layerId}`;
      panel.classList.toggle('active', isActive);
    });
  }

  initArtifact() {
    this.box = document.getElementById('artifact-box');
    if (!this.box) return;
    this.rotX = -15;
    this.rotY = 30;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.autoRotate = true;

    const apply = () => {
      this.box.style.transform = `rotateX(${this.rotX}deg) rotateY(${this.rotY}deg)`;
    };

    const onStart = (x, y) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.startX = x;
      this.startY = y;
      this.box.style.cursor = 'grabbing';
    };

    const onMove = (x, y) => {
      if (!this.isDragging) return;
      const dx = x - this.startX;
      const dy = y - this.startY;
      this.rotY += dx * 0.5;
      this.rotX += dy * 0.3;
      this.rotX = Math.max(-45, Math.min(45, this.rotX));
      this.startX = x;
      this.startY = y;
      apply();
    };

    const onEnd = () => {
      this.isDragging = false;
      this.box.style.cursor = 'grab';
    };

    this.box.addEventListener('mousedown', e => { e.preventDefault(); onStart(e.clientX, e.clientY); });
    document.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', onEnd);

    this.box.addEventListener('touchstart', e => {
      const t = e.touches[0];
      onStart(t.clientX, t.clientY);
    }, { passive: true });
    this.box.addEventListener('touchmove', e => {
      const t = e.touches[0];
      onMove(t.clientX, t.clientY);
    }, { passive: true });
    this.box.addEventListener('touchend', onEnd, { passive: true });

    this.box.style.cursor = 'grab';
    apply();

    const autoTick = () => {
      if (this.autoRotate) {
        this.rotY += 0.3;
        apply();
      }
      if (!this.isDragging) {
        this.autoRotate = true;
      }
      this.rafId = requestAnimationFrame(autoTick);
    };
    this.rafId = requestAnimationFrame(autoTick);
  }
}
