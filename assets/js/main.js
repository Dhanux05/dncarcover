/* DN Car Covers — behaviour. Data (prices, phone, colours, vehicles) lives in config.js. */
(function () {
  'use strict';
  const C = window.CK;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');
  const wa = t => 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(t);
  const colour = id => C.colours.find(c => c.id === id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const BRAND = C.brand;

  /* ---------- loader ---------- */
  const loader = $('#loader');
  const hideLoader = () => { loader.classList.add('out'); setTimeout(() => loader.remove(), 700); document.body.classList.add('ready'); };
  setTimeout(hideLoader, reduce ? 50 : 1250);

  /* ---------- WhatsApp wiring + icon ---------- */
  const WA_ICON = '<svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.52.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.3 1.263.489 1.694.626.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  function wire(root) {
    $$('[data-wa]', root).forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
    $$('a[href^="https://wa.me"]', root).forEach(a => { if (!a.querySelector('.wa-ic') && !a.classList.contains('foot-wa')) a.insertAdjacentHTML('afterbegin', WA_ICON); });
  }

  /* ---------- static fills ---------- */
  $$('[data-p]').forEach(el => { const p = el.dataset.p.split('.'); el.textContent = Number(C.prices[p[0]][p[1]]).toLocaleString('en-IN'); });
  $('#yr').textContent = new Date().getFullYear();
  $('#foot-wa-link').textContent = 'WhatsApp ' + C.phoneDisplay;
  $('#foot-extra').textContent = [C.email, C.address].filter(Boolean).join(' · ');

  /* ---------- header, progress, menu, dock ---------- */
  const hdr = $('#hdr'), prog = $('#progress'), dock = $('#dock'), hero = $('#hero');
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    hdr.classList.toggle('solid', y > 40);
    dock.classList.toggle('show', y > innerHeight * 0.6);
    if (!reduce && y < innerHeight * 1.2) $('#slides').style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0)';
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('lock', open);
  }
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- reveal ---------- */
  function reveal(root) {
    const els = $$('.rv:not(.in)', root);
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(en => en.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    els.forEach(e => io.observe(e));
  }

  /* ---------- hero slider ---------- */
  const slides = $$('.slide'), tabs = $$('#hero-tabs button');
  let cur = 0, timer = null;
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('on', k === cur));
    tabs.forEach((t, k) => {
      t.classList.toggle('on', k === cur); t.setAttribute('aria-selected', k === cur);
      const bar = $('i', t); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    });
    restart();
  }
  function restart() { clearInterval(timer); if (!reduce) timer = setInterval(() => go(cur + 1), 6500); }
  tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
  let tx = 0;
  hero.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
  restart();

  /* ---------- marquee ---------- */
  const mq = $('#marq'); mq.innerHTML += mq.innerHTML;

  /* stats count-up */
  (function () {
    const els = $$('.stats-in b'); if (!els.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, to = parseFloat(el.dataset.n), suf = el.dataset.s, dec = String(el.dataset.n).indexOf('.') > -1 ? 1 : 0, t0 = performance.now();
      (function tick(t) { const k = Math.min(1, (t - t0) / 1400), v = to * (1 - Math.pow(1 - k, 3)); el.textContent = v.toFixed(dec) + (k === 1 ? suf : (suf === 'k+' ? 'k' : '')); if (k < 1) requestAnimationFrame(tick); })(t0);
    }), { threshold: .5 });
    els.forEach(el => io.observe(el));
  })();

  /* hero WhatsApp button: rotating prompt */
  (function () {
    const el = $('#hw-line'); if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const L = ['Order your cover', 'Enquire about your car model', 'Get a quick quote', 'Ask about bike & scooter covers'];
    let i = 0;
    setInterval(() => { el.classList.add('out'); setTimeout(() => { i = (i + 1) % L.length; el.textContent = L[i]; el.classList.remove('out'); }, 350); }, 2800);
  })();

  /* ---------- colour stage ---------- */
  const cs = { v: 'car', c: 'blue' };
  const swBox = $('#cs-sw'), zones = $('#cs-zones');
  const lu = (v, id) => 'assets/img/lu-' + v + '-' + id + '.webp';
  const csShow = id => { const im = $('#cs-img'), s = lu(cs.v, id); if (!im.src.endsWith(s)) im.src = s; };
  ['car', 'bike'].forEach(v => ['blue', 'grey', 'black'].forEach(id => { new Image().src = lu(v, id); }));
  C.colours.forEach(c => {
    const z = document.createElement('button'); z.type = 'button'; z.className = 'zone'; z.setAttribute('aria-label', c.name); z.dataset.id = c.id;
    z.addEventListener('click', () => csSet(c.id)); z.addEventListener('mouseenter', () => csShow(c.id)); z.addEventListener('mouseleave', () => csShow(cs.c)); z.addEventListener('focus', () => csShow(c.id)); z.addEventListener('blur', () => csShow(cs.c)); zones.appendChild(z);
    const s = document.createElement('button'); s.type = 'button'; s.className = 'chip' + (c.camo ? ' camo' : ''); s.style.setProperty('--c', c.hex); s.setAttribute('aria-label', c.name); s.dataset.id = c.id;
    s.addEventListener('click', () => csSet(c.id)); s.addEventListener('mouseenter', () => csShow(c.id)); s.addEventListener('mouseleave', () => csShow(cs.c)); swBox.appendChild(s);
  });
  const ZP = {
    car: [
      [[840,0],[840,330],[800,358],[735,395],[680,430],[630,470],[600,520],[590,580],[592,640],[605,670],[605,909]],
      [[1280,0],[1280,285],[1230,310],[1170,355],[1120,395],[1060,435],[1010,480],[978,540],[973,620],[985,700],[1000,740],[1000,909]]],
    bike: [
      [[810,0],[810,285],[800,330],[790,375],[760,430],[725,500],[695,570],[683,630],[690,670],[700,700],[700,909]],
      [[1215,0],[1215,285],[1205,320],[1195,365],[1160,410],[1120,460],[1095,520],[1082,590],[1082,650],[1092,700],[1100,909]]]
  };
  function csZones() {
    const pc = ([x, y]) => (x / 1731 * 100).toFixed(2) + '% ' + (y / 909 * 100).toFixed(2) + '%';
    const [A, B] = ZP[cs.v];
    const polys = [[[0, 0], ...A, [0, 909]], [...A, ...B.slice().reverse()], [...B, [1731, 909], [1731, 0]]];
    $$('.zone', zones).forEach((z, k) => { z.style.clipPath = 'polygon(' + polys[k].map(pc).join(',') + ')'; });
  }
  function csSet(id) {
    csZones();
    cs.c = id;
    csShow(id); $('#cs-img').alt = 'DN ' + (cs.v === 'car' ? 'car' : 'bike') + ' covers in dark blue, cement grey and black, with ' + colour(id).name + ' selected';
    $$('.chip', swBox).forEach(s => s.setAttribute('aria-pressed', s.dataset.id === id));
    $('#cs-name').textContent = colour(id).name;
    const o = $('#cs-order');
    o.href = wa('Hi ' + BRAND + ", I'd like to order a " + (cs.v === 'car' ? 'car' : 'bike') + ' cover in ' + colour(id).name + ' (' + inr(C.prices[cs.v].premium) + ').\nMy vehicle is: ');
    if (!o.querySelector('.wa-ic')) o.insertAdjacentHTML('afterbegin', WA_ICON);
  }
  $$('#cs-switch button').forEach(b => b.addEventListener('click', () => {
    cs.v = b.dataset.v; $$('#cs-switch button').forEach(x => x.classList.toggle('on', x === b));
    csSet(cs.c);
  }));
  csSet('blue');

  /* ---------- gallery + lightbox ---------- */
  const reel = $('#reel'), shots = $$('.shot', reel), lb = $('#lb');
  let li = 0, down = false, sx = 0, sl = 0, moved = false;
  reel.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = reel.scrollLeft; reel.classList.add('drag'); });
  addEventListener('pointerup', () => { down = false; reel.classList.remove('drag'); });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; reel.scrollLeft = sl - dx; });
  function showLb(i) {
    li = (i + shots.length) % shots.length; const s = shots[li], im = $('img', s);
    $('#lb-img').src = im.currentSrc || im.src; $('#lb-img').alt = im.alt; $('#lb-cap').textContent = s.dataset.cap;
  }
  shots.forEach((s, i) => s.addEventListener('click', () => { if (moved) return; showLb(i); if (lb.showModal) lb.showModal(); else lb.setAttribute('open', ''); document.body.classList.add('lock'); }));

  /* gallery: slow auto-scroll + arrows */
  const rp = $('#reel-prev'), rn = $('#reel-next');
  const step = () => { const s = shots[0]; return s.getBoundingClientRect().width + 12; };
  let auto = !matchMedia('(prefers-reduced-motion: reduce)').matches, paused = false, vis = false, acc = 0, pauseT;
  const hold = (ms = 3500) => { paused = true; clearTimeout(pauseT); pauseT = setTimeout(() => { paused = false; }, ms); };
  const rgo = d => { reel.classList.remove('auto'); hold(5000); const max = reel.scrollWidth - reel.clientWidth;
    if (d > 0 && reel.scrollLeft >= max - 4) reel.scrollTo({ left: 0, behavior: 'smooth' });
    else if (d < 0 && reel.scrollLeft <= 4) reel.scrollTo({ left: max, behavior: 'smooth' });
    else reel.scrollBy({ left: d * step(), behavior: 'smooth' }); };
  rp.addEventListener('click', () => rgo(-1)); rn.addEventListener('click', () => rgo(1));
  ['mouseenter', 'touchstart', 'focusin', 'pointerdown'].forEach(ev => reel.addEventListener(ev, () => { paused = true; clearTimeout(pauseT); }, { passive: true }));
  ['mouseleave', 'focusout'].forEach(ev => reel.addEventListener(ev, () => hold(1200)));
  reel.addEventListener('touchend', () => hold(3000), { passive: true });
  new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(reel);
  let last = 0;
  const tick = t => { const dt = Math.min(t - last, 50); last = t;
    if (auto && vis && !paused && !down && !(lb && lb.open)) {
      acc += dt * 0.055; const px = Math.floor(acc);
      if (px) { acc -= px; reel.classList.add('auto'); const max = reel.scrollWidth - reel.clientWidth;
        if (reel.scrollLeft >= max - 1) { paused = true; setTimeout(() => { reel.scrollTo({ left: 0, behavior: 'smooth' }); setTimeout(() => { paused = false; }, 1200); }, 900); }
        else reel.scrollLeft += px; } }
    requestAnimationFrame(tick); };
  requestAnimationFrame(tick);

  /* gallery dots */
  const rdots = $('#reel-dots');
  if (rdots) {
    shots.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Photo ' + (i + 1)); b.addEventListener('click', () => { hold(5000); reel.classList.remove('auto'); reel.scrollTo({ left: shots[i].offsetLeft - shots[0].offsetLeft, behavior: 'smooth' }); }); rdots.appendChild(b); });
    const mark = () => { const max = reel.scrollWidth - reel.clientWidth; let k = 0;
      if (reel.scrollLeft >= max - 4) k = shots.length - 1; else { const x = reel.scrollLeft + shots[0].offsetLeft; shots.forEach((s, i) => { if (s.offsetLeft <= x + 4) k = i; }); }
      Array.from(rdots.children).forEach((d, i) => d.classList.toggle('on', i === k)); };
    reel.addEventListener('scroll', mark, { passive: true }); mark();
  }
  const closeLb = () => { if (lb.close) lb.close(); else lb.removeAttribute('open'); document.body.classList.remove('lock'); };
  $('#lb-x').addEventListener('click', closeLb);
  $('#lb-p').addEventListener('click', () => showLb(li - 1));
  $('#lb-nx').addEventListener('click', () => showLb(li + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  lb.addEventListener('close', () => document.body.classList.remove('lock'));
  let lx = 0;
  lb.addEventListener('touchstart', e => { lx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - lx; if (Math.abs(d) > 50) showLb(li + (d < 0 ? 1 : -1)); }, { passive: true });
  addEventListener('keydown', e => { if (!lb.open) return; if (e.key === 'ArrowRight') showLb(li + 1); if (e.key === 'ArrowLeft') showLb(li - 1); });

  /* ---------- desktop extras: cursor + magnetic buttons ---------- */
  if (fine && !reduce) {
    const cu = $('#cursor'); let x = 0, y = 0, tx2 = 0, ty = 0;
    document.body.classList.add('has-cursor');
    addEventListener('mousemove', e => { tx2 = e.clientX; ty = e.clientY; });
    (function loop() { x += (tx2 - x) * 0.2; y += (ty - y) * 0.2; cu.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => cu.classList.toggle('big', !!e.target.closest('a,button,summary,.zone,.shot,.panel,select,input')));
    $$('.btn, .foot-wa').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.12) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.2) + 'px)'; });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  wire(document); reveal(document);
})();
