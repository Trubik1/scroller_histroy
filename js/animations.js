class ScrollytellingAnimations {
  constructor() {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reduced) {
      this.init();
    }
  }

  init() {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => this.initDesktop());
    mm.add('(max-width: 767px)', () => this.initMobile());
    this.initCommon();
  }

  initCommon() {
    this.animateHero();
    this.animateTimeline();
    this.animateVoices();
    this.animateLayers();
    this.animateFinal();
    this.setupProgressBar();
    this.setupSectionTriggers();
  }

  initDesktop() {
    this.animateChapter();
    this.animatePortrait();
    this.animateDrama();
    this.animateToday();
  }

  initMobile() {
    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.batch('[data-animate]', {
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out', overwrite: 'auto' })
    });
    ScrollTrigger.batch('[data-animate="fade-up"] > *, [data-animate="stagger-facts"] > *', {
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
    });
    this.animateDramaMobile();
    this.animateTodayMobile();
  }

  animateDramaMobile() {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#section-4', start: 'top 85%', end: 'top 30%', scrub: 0.5 }
    });
    tl.fromTo('.drama-watermark', { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 0.02, duration: 1, ease: 'power3.out' }, '<');
    tl.fromTo('.drama-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '<0.1');
    tl.fromTo('.drama-text p', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' }, '<0.15');
    tl.fromTo('.drama-divider', { width: '0%' }, { width: '100%', duration: 0.8, ease: 'power2.inOut' }, '<0.2');
    tl.fromTo('.drama-quote', { scale: 0.97, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, '<0.15');
    ScrollTrigger.create({
      trigger: '.drama-quote',
      start: 'top 85%',
      onEnter: () => {
        if (!this.reduced) {
          document.querySelector('.drama-content')?.classList.add('screen-shake');
          setTimeout(() => document.querySelector('.drama-content')?.classList.remove('screen-shake'), 300);
        }
      }
    });
  }

  animateHero() {
    gsap.fromTo('.hero-kicker', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo('.hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, delay: 0.4, ease: 'power2.out' });
    gsap.fromTo('.hero-subtitle', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'power2.out' });
    gsap.fromTo('.hero-scroll-hint', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1, ease: 'power2.out' });
    if (!this.reduced) {
      gsap.to('.hero-bg img', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: '#section-1', start: 'top top', end: 'bottom top', scrub: 1 }
      });
    }
  }

  animateChapter() {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#section-2', start: 'top 70%', end: 'top 20%', scrub: 1 }
    });
    tl.to('[data-animate="slide-left"]', { x: 0, opacity: 1, ease: 'power2.out', duration: 1.2 });
    tl.to('[data-animate="fade-up"]', { opacity: 1, duration: 0.01 }, '<');
    tl.to('[data-animate="fade-up"] > *', {
      y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out'
    }, '<0.1');
    if (!this.reduced) {
      gsap.to('.chapter-media img', {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: '#section-2', start: 'top bottom', end: 'bottom top', scrub: 0.5 }
      });
    }
  }

  animatePortrait() {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#section-3', start: 'top 75%', end: 'top 30%', scrub: 0.8 }
    });
    tl.fromTo('.portrait-media', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '<');
    tl.fromTo('.portrait-frame', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }, '<0.1');
    tl.to('.portrait-circle', {
      strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut'
    }, '<0.1');
    tl.fromTo('.portrait-archive', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.7, duration: 1, ease: 'power3.out' }, '<0.2');
    tl.fromTo('.portrait-info', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '<0.15');
    const factsTl = gsap.timeline({
      scrollTrigger: { trigger: '#section-3 .portrait-facts', start: 'top 85%', end: 'top 45%', scrub: 1 }
    });
    factsTl.to('[data-animate="stagger-facts"]', { opacity: 1, duration: 0.01 });
    factsTl.to('[data-animate="stagger-facts"] > *', {
      y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: 'power2.out'
    }, '<');
    if (!this.reduced) {
      gsap.to('.portrait-frame', {
        rotation: 1, ease: 'sine.inOut',
        scrollTrigger: { trigger: '#section-3', start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }
    gsap.fromTo('.portrait-quote', { y: 20, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: '#section-3 .portrait-quote', start: 'top 85%', end: 'top 50%', scrub: 1 }
    });
  }

  animateDrama() {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#section-4', start: 'top 80%', end: 'center center', scrub: 0.5 }
    });
    tl.fromTo('.drama-bg', { opacity: 0.18 }, { opacity: 1, backgroundColor: '#8b2635', duration: 1.5, ease: 'power2.inOut' });
    tl.fromTo('.drama-watermark', { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 0.03, duration: 1.5, ease: 'power3.out' }, '<');
    tl.fromTo('.drama-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, '<0.1');
    tl.fromTo('.drama-text p', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out' }, '<0.2');
    tl.to('.drama-divider', { width: '100%', duration: 1, ease: 'power2.inOut' }, '<0.3');
    tl.fromTo('.drama-quote', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, '<0.2');
    ScrollTrigger.create({
      trigger: '.drama-quote',
      start: 'top 80%',
      onEnter: () => {
        if (!this.reduced) {
          document.querySelector('.drama-content')?.classList.add('screen-shake');
          setTimeout(() => document.querySelector('.drama-content')?.classList.remove('screen-shake'), 300);
        }
      }
    });
  }

  animateTimeline() {
    gsap.to('#timeline-fill', {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: '#section-6', start: 'top 10%', end: 'bottom 90%', scrub: 0.3 }
    });
    const events = document.querySelectorAll('.timeline-event');
    events.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        end: 'top 40%',
        onEnter: () => {
          el.classList.add('visible');
          el.querySelector('.event-dot')?.classList.add('active');
        }
      });
    });
  }

  animateVoices() {
    gsap.to('[data-animate="drop-in"]', {
      y: 0, rotate: 0, opacity: 1, stagger: 0.3, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '#section-8', start: 'top 70%', end: 'bottom 30%', scrub: 1 }
    });
  }

  animateLayers() {
    gsap.fromTo('.layers-header', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '#section-7', start: 'top 80%', end: 'top 40%', scrub: 1 } });
    gsap.fromTo('.layer-tab', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '#section-7', start: 'top 75%', end: 'top 35%', scrub: 1 } });
    gsap.fromTo('.layer-panel.active .layer-img', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '#section-7', start: 'top 70%', end: 'top 30%', scrub: 1 } });
    gsap.fromTo('.layer-panel.active .layer-caption', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: '#section-7', start: 'top 70%', end: 'top 30%', scrub: 1 } });
  }

  animateToday() {
    gsap.fromTo('.today-info', { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: '#section-9', start: 'top 70%', end: 'top 35%', scrub: 1 } });
    gsap.fromTo('.today-map', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: '#section-9 .today-map', start: 'top 80%', end: 'top 40%', scrub: 1 } });
    gsap.fromTo('.today-bg img', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power2.out',
      scrollTrigger: { trigger: '#section-9', start: 'top 70%', end: 'top 30%', scrub: 1 } });
  }

  animateTodayMobile() {
    gsap.fromTo('.today-bg img', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power2.out',
      scrollTrigger: { trigger: '#section-9', start: 'top 80%', end: 'top 40%', scrub: 1 } });
  }

  animateFinal() {
    gsap.fromTo('.final-quote', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: 'power3.out',
      scrollTrigger: { trigger: '#section-10', start: 'top 80%', end: 'top 50%', scrub: 1 } });
    gsap.fromTo('.final-signature', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '#section-10 .final-signature', start: 'top 80%', end: 'top 50%', scrub: 1 } });
    gsap.fromTo('.final-buttons', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '#section-10 .final-buttons', start: 'top 80%', end: 'top 50%', scrub: 1 } });
  }

  setupProgressBar() {
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        const pct = Math.round(self.progress * 100);
        const fill = document.getElementById('progress-fill');
        if (fill) fill.style.width = pct + '%';
        const bar = document.querySelector('.nav-progress');
        if (bar) bar.setAttribute('aria-valuenow', pct);
      }
    });
  }

  setupSectionTriggers() {
    for (let i = 1; i <= 10; i++) {
      const el = document.getElementById(`section-${i}`);
      if (!el) continue;
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
          el.classList.add('active');
        }
      });
    }
    ScrollTrigger.create({
      trigger: '#section-9 .today-map',
      start: 'top 110%',
      onEnter: () => this.initMap()
    });
  }

  initMap() {
    if (window._mapInitialized) return;
    if (typeof L === 'undefined') {
      setTimeout(() => this.initMap(), 500);
      return;
    }
    window._mapInitialized = true;
    const mapEl = document.getElementById('map');
    if (!mapEl) return;
    const map = L.map(mapEl, { zoomControl: false, dragging: false, scrollWheelZoom: false }).setView([52.4222, 31.0169], 16);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
    const histLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
      opacity: 0.7
    });
    const goldIcon = L.divIcon({ className: 'custom-marker', html: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#c9a961" stroke="#0a0a0a" stroke-width="2"/></svg>', iconSize: [24, 24], iconAnchor: [12, 12] });
    L.marker([52.4222, 31.0169], { icon: goldIcon }).addTo(map).bindPopup('Дворец Румянцевых-Паскевичей');
    const btn = document.getElementById('btn-historical-map');
    if (btn) {
      btn.addEventListener('click', () => {
        const active = btn.classList.toggle('active');
        btn.setAttribute('aria-pressed', active);
        if (active) { histLayer.addTo(map); } else { map.removeLayer(histLayer); }
      });
    }
    setTimeout(() => map.invalidateSize(), 500);
  }
}
