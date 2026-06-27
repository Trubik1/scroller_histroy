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
        3D-модель загружается...
      </div>`;
  }

  init() {
    if (typeof THREE === 'undefined') throw new Error('Three.js not loaded');

    const w = this.container.clientWidth || 400;
    const h = this.container.clientHeight || 300;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.set(0, 2, 5);

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
      this.controls.autoRotateSpeed = 2.0;
      this.controls.minDistance = 2;
      this.controls.maxDistance = 10;
      this.controls.target.set(0, 0.5, 0);
    }

    this.addLights();
    this.loadModel();

    window.addEventListener('resize', () => {
      const w2 = this.container.clientWidth || 400;
      const h2 = this.container.clientHeight || 300;
      this.camera.aspect = w2 / h2;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w2, h2);
    });

    this.animate();
  }

  addLights() {
    this.scene.add(new THREE.AmbientLight(0x404060, 0.5));
    const key = new THREE.DirectionalLight(0xffdcaa, 2.0);
    key.position.set(5, 10, 7);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x8888ff, 0.5);
    fill.position.set(-3, 2, -5);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xc9a961, 0.8);
    rim.position.set(-2, 1, 6);
    this.scene.add(rim);
  }

  loadModel() {
    if (typeof THREE.OBJLoader === 'undefined') {
      console.warn('OBJLoader not available, using fallback');
      this.buildFallback();
      return;
    }

    const loader = new THREE.OBJLoader();
    loader.load(
      'assets/models/sword/Sword.obj',
      (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xc9a961,
              roughness: 0.3,
              metalness: 0.7
            });
          }
        });

        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        obj.scale.setScalar(scale);

        obj.position.sub(center.multiplyScalar(scale));
        obj.position.y += size.y * scale * 0.5;

        this.scene.add(obj);
      },
      undefined,
      (err) => {
        console.warn('Failed to load OBJ:', err);
        this.buildFallback();
      }
    );
  }

  buildFallback() {
    const group = new THREE.Group();
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a961, roughness: 0.3, metalness: 0.7 });

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.5, 0.03), goldMat);
    blade.position.y = 1.2;
    group.add(blade);

    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.08), goldMat);
    guard.position.y = 0.1;
    group.add(guard);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8), goldMat);
    handle.position.y = -0.2;
    group.add(handle);

    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), goldMat);
    pommel.position.y = -0.45;
    group.add(pommel);

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
