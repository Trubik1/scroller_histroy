class Artifact3D {
  constructor(container) {
    this.container = container;
    try {
      this.init();
    } catch (e) {
      console.warn('Artifact3D init failed:', e);
      this.showFallback();
    }
  }

  showFallback() {
    this.container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:#c9a961;font-family:monospace;font-size:0.8rem;text-align:center;padding:1rem;">
        3D-модель загружается...<br>Попробуйте обновить страницу
      </div>`;
  }

  init() {
    if (typeof THREE === 'undefined') {
      throw new Error('Three.js not loaded');
    }

    const w = this.container.clientWidth || 400;
    const h = this.container.clientHeight || 300;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.set(6, 3, 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.5;
      this.controls.minDistance = 4;
      this.controls.maxDistance = 20;
      this.controls.maxPolarAngle = Math.PI / 2.2;
      this.controls.target.set(0, 0.5, 0);
    }

    this.buildPalace();
    this.addLights();

    const resize = () => {
      const w2 = this.container.clientWidth || 400;
      const h2 = this.container.clientHeight || 300;
      this.camera.aspect = w2 / h2;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', resize);

    this.animate();
  }

  addLights() {
    this.scene.add(new THREE.AmbientLight(0x404060, 0.4));
    const key = new THREE.DirectionalLight(0xffdcaa, 1.8);
    key.position.set(5, 10, 7);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x8888ff, 0.4);
    fill.position.set(-3, 2, -5);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xc9a961, 0.6);
    rim.position.set(-2, 1, 6);
    this.scene.add(rim);
  }

  buildPalace() {
    const gold = 0xc9a961;
    const wall = 0x2a2a3e;
    const roof = 0x3a2a1a;
    const group = new THREE.Group();

    const wallMat = new THREE.MeshStandardMaterial({ color: wall, roughness: 0.7, metalness: 0.1 });
    const goldMat = new THREE.MeshStandardMaterial({ color: gold, roughness: 0.3, metalness: 0.6 });
    const roofMat = new THREE.MeshStandardMaterial({ color: roof, roughness: 0.6, metalness: 0.2 });
    const stepsMat = new THREE.MeshStandardMaterial({ color: 0x3a3a4e, roughness: 0.9 });
    const wireMat = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.2 });

    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.6, 2.0), wallMat);
    mainBody.position.y = 0.8;
    group.add(mainBody);

    [-1, 1].forEach(side => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 1.6), wallMat);
      wing.position.set(side * 2.1, 0.5, 0);
      group.add(wing);
    });

    for (let i = 0; i < 5; i++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.2, 8), goldMat);
      col.position.set(-1.2 + i * 0.6, 0.6, 1.1);
      group.add(col);
    }

    const entablature = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 0.4), goldMat);
    entablature.position.set(0, 1.25, 1.1);
    group.add(entablature);

    const pediment = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 1.8, 0.8, 3), goldMat);
    pediment.position.set(0, 1.65, 1.1);
    pediment.rotation.z = Math.PI / 2;
    group.add(pediment);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.5), roofMat);
    dome.position.set(0, 1.6, 0);
    dome.scale.y = 0.4;
    group.add(dome);

    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.3, 6), goldMat);
    lantern.position.set(0, 1.95, 0);
    group.add(lantern);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 6), goldMat);
    spire.position.set(0, 2.15, 0);
    group.add(spire);

    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.6 - i * 0.15, 0.08, 0.3 - i * 0.05), stepsMat);
      step.position.set(0, -0.04 + i * 0.08, 1.25 + i * 0.15);
      group.add(step);
    }

    const addWire = (geo, px, py, pz) => {
      const edge = new THREE.EdgesGeometry(geo);
      const wire = new THREE.LineSegments(edge, wireMat);
      wire.position.set(px, py, pz);
      group.add(wire);
    };
    addWire(new THREE.BoxGeometry(3.22, 1.62, 2.02), 0, 0.8, 0);
    addWire(new THREE.BoxGeometry(1.42, 1.02, 1.62), -2.1, 0.5, 0);
    addWire(new THREE.BoxGeometry(1.42, 1.02, 1.62), 2.1, 0.5, 0);

    this.scene.add(group);
  }

  animate() {
    const raf = () => {
      this._rafId = requestAnimationFrame(raf);
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    this._rafId = requestAnimationFrame(raf);
  }
}
