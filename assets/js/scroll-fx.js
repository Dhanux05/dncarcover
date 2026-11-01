/* DN Car Covers: scroll animations on every page (reveal variants, stagger, light parallax). */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const skip = el => el.closest('.hero,.hdr,.menu,.dock,.pbar,#fwa,dialog,.ld,.foot');
  /* [selector, variant, stagger?] */
  const T = [
    ['.head > *', 'up', 1], ['.crumb', 'up'], ['.vt', 'up'],
    ['.panel', 'scale', 1], ['.stats-in li', 'up', 1], ['.brands-t', 'up'], ['.brands-view', 'scale'],
    ['.cs-photo', 'scale'], ['.cs-bar', 'up'], ['.bt', 'scale', 1], ['.vs', 'scale'],
    ['.steps li', 'up', 1], ['.geo-b', 'right'],
    ['.cu-in > *', 'up', 1], ['.cu-fig', 'right'], ['#faq details', 'up', 1], ['.filters', 'up'], ['.vc', 'up', 1], ['.more-models', 'up'],
    ['.pd-gal', 'left'], ['.pd-info', 'right'], ['.pd-sec', 'up'], ['.pd-spec', 'up'], ['.pd-feat li', 'up', 1]
  ];
  const hide = el => { if (!el.dataset.fx) return; };
  const items = [];
  T.forEach(([sel, v, st]) => {
    const groups = new Map();
    $$(sel).forEach(el => {
      if (skip(el) || el.dataset.fx) return;
      el.classList.remove('rv');
      el.dataset.fx = v;
      const g = el.parentElement; const n = groups.get(g) || 0; groups.set(g, n + 1);
      if (st) el.style.setProperty('--fd', Math.min(n, 6) * 0.09 + 's');
      items.push(el);
    });
  });
  document.documentElement.classList.add('fx-on');
  const done = el => setTimeout(() => { el.removeAttribute('data-fx'); el.classList.remove('fx-in'); el.style.removeProperty('--fd'); }, 1400);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    requestAnimationFrame(() => { e.target.classList.add('fx-in'); done(e.target); });
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(el => io.observe(el));
  /* failsafe: never leave content hidden */
  setTimeout(() => items.forEach(el => { if (el.dataset.fx && !el.classList.contains('fx-in')) { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('fx-in'); } }), 2500);

  /* light parallax on big photos */
  const P = $$('.panel img,.cs-photo img,.pd-stage img').filter(el => !skip(el) || el.closest('.panel,.cs-photo,.pd-stage'));
  P.forEach(el => el.classList.add('px'));
  let tick = false;
  const upd = () => { tick = false; const h = innerHeight;
    P.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < -100 || r.top > h + 100) return;
      const k = (r.top + r.height / 2 - h / 2) / h; el.style.setProperty('--py', (-k * 34).toFixed(1) + 'px'); }); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  addEventListener('resize', upd); upd();
})();
