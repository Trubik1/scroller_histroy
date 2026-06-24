(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.fonts.ready.then(() => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('hidden');
  });

  if (!reduced) {
    try {
      if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: window.innerWidth < 768 ? 0.8 : 1 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        if (window.innerWidth < 768) lenis.destroy();
      }
    } catch (e) {
      console.warn('Lenis not available, using native scroll');
    }
  }

  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  let audio = null;
  try { audio = new AudioManager(); } catch(e) { console.warn('AudioManager init failed'); }

  let slider = null;
  try {
    const container = document.getElementById('comparison-slider');
    if (container) slider = new ComparisonSlider(container);
  } catch(e) { console.warn('ComparisonSlider init failed'); }

  let animations = null;
  try { animations = new ScrollytellingAnimations(); } catch(e) { console.warn('Animations init failed'); }

  // Fallback: ensure all text is visible after 3 seconds even if GSAP fails
  setTimeout(() => {
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('[data-animate] > *').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }, 3000);

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });

  document.getElementById('btn-sources')?.addEventListener('click', () => {
    document.getElementById('sources-modal')?.classList.add('open');
  });

  document.getElementById('btn-restart')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  document.querySelector('.modal-close')?.addEventListener('click', () => {
    document.getElementById('sources-modal')?.classList.remove('open');
  });

  document.getElementById('sources-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('sources-modal')?.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('sources-modal')?.classList.remove('open');
    }
  });

  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button, .voice-card, .slider-handle').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing?.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing?.classList.remove('active'));
    });
  }

  if (audio) {
    const sections = document.querySelectorAll('.section');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = parseInt(entry.target.dataset.section);
          if (!isNaN(section)) audio.onSectionChange(section);
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => sectionObserver.observe(s));
  }

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[loading="lazy"]').forEach(img => imgObserver.observe(img));

  console.log('Дворец Румянцевых-Паскевичей · Scrollytelling');
  console.log('© 2026 · Создано для конкурса «Эхо времени»');
})();
