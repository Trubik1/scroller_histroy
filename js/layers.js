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
    const scene = document.getElementById('artifact-scene');
    if (!scene || typeof THREE === 'undefined') return;
    new Artifact3D(scene);
  }
}
