(() => {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const targets = [...document.querySelectorAll('.section-heading, .database-panel, .code-copy, .code-demo, .live-card, .signal-tool-card, .screen-card, .feature-card, .closing-content, .help-section-intro, .help-copy-block, .help-compare-card, .help-troubleshooting, .schedule-guide-hero, .schedule-step, .privacy-policy-card .mini-tag')];
  const photos = [...document.querySelectorAll('.field-hero, .field-companion')];
  let observer;
  let frame = 0;
  const render = () => {
    frame = 0;
    if (motion.matches) return;
    const range = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / range));
    root.style.setProperty('--pine-left-shift', (-36 * progress).toFixed(2) + 'px');
    root.style.setProperty('--pine-right-shift', (-22 * progress).toFixed(2) + 'px');
    photos.forEach(photo => {
      const rect = photo.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight));
      photo.style.setProperty('--photo-shift', (offset * Math.min(12, rect.height * .025)).toFixed(2) + 'px');
    });
  };
  const schedule = () => { if (!motion.matches && !frame) frame = requestAnimationFrame(render); };
  const configure = () => {
    observer?.disconnect();
    document.body.classList.remove('has-motion');
    targets.forEach(target => target.classList.remove('soft-enter', 'is-in-view'));
    if (motion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      root.style.removeProperty('--pine-left-shift');
      root.style.removeProperty('--pine-right-shift');
      photos.forEach(photo => photo.style.removeProperty('--photo-shift'));
      return;
    }
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in-view');
          observer.unobserve(entry.target);
        });
      }, { threshold: .08, rootMargin: '0px 0px -18px 0px' });
      targets.forEach(target => {
        target.classList.add('soft-enter');
        const rect = target.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) target.classList.add('is-in-view');
        else observer.observe(target);
      });
    }
    document.body.classList.add('has-motion');
    schedule();
  };
  configure();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  document.fonts?.ready.then(schedule);
  motion.addEventListener?.('change', configure);
})();
