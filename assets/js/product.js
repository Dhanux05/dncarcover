/* DN Car Covers — product page behaviour. Data (prices, phone, vehicles) comes from config.js. */
(function () {
  'use strict';
  const C = window.CK, D = window.PD;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');
  const wa = t => 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(t);
  const price = C.prices[D.v][D.f];
  const WA_ICON = '<svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.52.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.3 1.263.489 1.694.626.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';

  /* prices + footer */
  $$('[data-p]').forEach(el => { const p = el.dataset.p.split('.'); el.textContent = Number(C.prices[p[0]][p[1]]).toLocaleString('en-IN'); });
  $('#yr').textContent = new Date().getFullYear();
  $('#foot-wa-link').textContent = 'WhatsApp ' + C.phoneDisplay;
  $('#foot-extra').textContent = [C.email, C.address].filter(Boolean).join(' · ');

  /* header, progress, menu */
  const hdr = $('#hdr'), prog = $('#progress');
  function onScroll() {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    hdr.classList.toggle('solid', scrollY > 10);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open); menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('lock', open);
  }
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* gallery */
  const img = $('#gal-img'), cnt = $('#gal-c'), th = $$('#thumbs .th');
  let gi = 0;
  function show(i) {
    gi = (i + D.imgs.length) % D.imgs.length;
    img.src = D.imgs[gi].s; img.alt = D.imgs[gi].a;
    cnt.textContent = (gi + 1) + ' / ' + D.imgs.length;
    th.forEach((t, k) => t.classList.toggle('on', k === gi));
    const t = th[gi]; if (t && t.scrollIntoView) { const box = $('#thumbs'); box.scrollTo({ left: t.offsetLeft - 12, behavior: 'smooth' }); }
  }
  th.forEach((t, k) => t.addEventListener('click', () => show(k)));
  $('#gal-p').addEventListener('click', () => show(gi - 1));
  $('#gal-n').addEventListener('click', () => show(gi + 1));
  let tx = 0; const st = $('.pd-stage');
  st.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  st.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) show(gi + (d < 0 ? 1 : -1)); }, { passive: true });
  $('#gal').addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(gi - 1); if (e.key === 'ArrowRight') show(gi + 1); });

  const col = null; show(0);

  /* vehicle picker */
  const V = C.vehicles, groups = D.cat === 'Car' ? ['Car'] : ['Bike', 'Scooter'];
  const makes = {};
  groups.forEach(g => Object.keys(V[g] || {}).forEach(m => { makes[m] = (makes[m] || []).concat(V[g][m]); }));
  const mk = $('#mk'), md = $('#md');
  Object.keys(makes).sort().forEach(m => mk.add(new Option(m, m)));
  mk.add(new Option('Other / not listed', '__other'));
  mk.addEventListener('change', () => {
    md.length = 1; md.disabled = true;
    if (mk.value && mk.value !== '__other') { Array.from(new Set(makes[mk.value])).forEach(m => md.add(new Option(m, m))); md.disabled = false; }
    md.value = ''; msg();
  });
  md.addEventListener('change', msg);

  /* order links */
  function vehicle() {
    if (mk.value === '__other') return '';
    return [mk.value, md.value].filter(Boolean).join(' ');
  }
  function msg() {
    const v = vehicle();
    const t = "Hi DN Car Covers, I'd like to order the " + D.name + ', ' + D.tag + ' (' + inr(price) + ').\nMy vehicle is: ' + v;
    $('#order').href = wa(t); $('#order2').href = wa(t);
    $('#ask').href = wa('Hi DN Car Covers, I have a question about the ' + D.name + ' (' + D.tag + ').' + (v ? '\nMy vehicle: ' + v : ''));
    $('#fit-hint').textContent = v ? 'Great. We will confirm the fit for the ' + v + ' on WhatsApp.' : (mk.value === '__other' ? 'Tell us your vehicle on WhatsApp and we will confirm the fit.' : $('#fit-hint').dataset.d);
  }
  $('#fit-hint').dataset.d = $('#fit-hint').textContent;

  /* generic data-wa links + icon */
  $$('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
  msg();
  $$('a[href^="https://wa.me"]').forEach(a => { if (!a.querySelector('.wa-ic') && !a.classList.contains('foot-wa')) a.insertAdjacentHTML('afterbegin', WA_ICON); });

  /* sticky order bar after the main button leaves the screen */
  const bar = $('#pbar'), main = $('#order');
  new IntersectionObserver(es => { bar.classList.toggle('show', !es[0].isIntersecting && es[0].boundingClientRect.top < 0); }).observe(main);
})();
