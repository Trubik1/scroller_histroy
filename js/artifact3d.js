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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    this.addGround();
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
    key.castShadow = true;
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x8888ff, 0.5);
    fill.position.set(-3, 2, -5);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xc9a961, 0.8);
    rim.position.set(-2, 1, 6);
    this.scene.add(rim);

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x111122);
    const envLight1 = new THREE.PointLight(0xffdcaa, 1, 20);
    envLight1.position.set(5, 5, 5);
    envScene.add(envLight1);
    const envLight2 = new THREE.PointLight(0x8888ff, 1, 20);
    envLight2.position.set(-5, 3, -5);
    envScene.add(envLight2);
    const envTexture = pmremGenerator.fromScene(envScene).texture;
    this.scene.environment = envTexture;
    pmremGenerator.dispose();
  }

  addGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.95,
        metalness: 0.0
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  loadModel() {
    if (typeof THREE.OBJLoader === 'undefined') {
      console.warn('OBJLoader not available, using fallback');
      this.buildFallback();
      return;
    }

    const textureLoader = new THREE.TextureLoader();
    const loadTex = (path) => textureLoader.load(path, undefined, undefined, () => null);

    const colorMap = loadTex('assets/models/sword/metal.png');
    const normalMap = loadTex('assets/models/sword/Textures/TextureNormal.jpg');
    const roughnessMap = loadTex('assets/models/sword/Textures/TextureReflection.jpg');
    const bumpMap = loadTex('assets/models/sword/Textures/TextureBump.jpg');

    const loader = new THREE.OBJLoader();
    loader.load(
      'assets/models/sword/Sword.obj',
      (obj) => {
        const bladeMat = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          map: colorMap,
          normalMap: normalMap,
          roughnessMap: roughnessMap,
          bumpMap: bumpMap,
          bumpScale: 0.02,
          roughness: 0.25,
          metalness: 0.9,
          envMapIntensity: 1.5
        });

        const goldMat = new THREE.MeshStandardMaterial({
          color: 0xc9a961,
          roughness: 0.3,
          metalness: 0.8,
          envMapIntensity: 1.2
        });

        const leatherMat = new THREE.MeshStandardMaterial({
          color: 0x3d2b1f,
          roughness: 0.8,
          metalness: 0.1
        });

        obj.traverse((child) => {
          if (child.isMesh) {
            const name = child.name.toLowerCase();
            if (name.includes('guard') || name.includes('cross') || name.includes('pommel') || name.includes('ring')) {
              child.material = goldMat;
            } else if (name.includes('handle') || name.includes('grip') || name.includes('wrap')) {
              child.material = leatherMat;
            } else {
              child.material = bladeMat;
            }
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
