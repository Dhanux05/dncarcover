/* DN Car Covers — car model product page: gallery with zoom, colour, quantity, WhatsApp order. */
(function () {
  'use strict';
  const { C, $, $$, inr, wa, wire } = window.DN, D = window.VD;
  let col = D.shown, qty = 1, gi = 0, zoomed = false;
  const unit = () => D.pw;

  /* gallery */
  const img = $('#gal-img'), cnt = $('#gal-c'), th = $$('#thumbs .th'), stage = $('#stage'), zm = $('#zm');
  function setZoom(on) {
    zoomed = on; stage.classList.toggle('zoomed', on); zm.setAttribute('aria-pressed', on); zm.textContent = on ? '−' : '+';
    if (!on) img.style.transformOrigin = '50% 50%';
  }
  function show(i) {
    gi = (i + D.imgs.length) % D.imgs.length; setZoom(false);
    img.src = D.imgs[gi].s; img.alt = D.imgs[gi].a; cnt.textContent = (gi + 1) + ' / ' + D.imgs.length;
    th.forEach((t, k) => t.classList.toggle('on', k === gi));
  }
  th.forEach((t, k) => t.addEventListener('click', () => show(k)));
  $('#gal-p').addEventListener('click', () => show(gi - 1));
  $('#gal-n').addEventListener('click', () => show(gi + 1));
  zm.addEventListener('click', () => setZoom(!zoomed));
  img.addEventListener('click', () => setZoom(!zoomed));
  stage.addEventListener('mousemove', e => {
    if (!zoomed) return; const r = stage.getBoundingClientRect();
    img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
  });
  let tx = 0;
  stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (!zoomed && Math.abs(d) > 40) show(gi + (d < 0 ? 1 : -1)); }, { passive: true });
  $('#gal').addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(gi - 1); if (e.key === 'ArrowRight') show(gi + 1); if (e.key === 'Escape') setZoom(false); });

  /* options */
  $('#qm').addEventListener('click', () => { qty = Math.max(1, qty - 1); update(); });
  $('#qp').addEventListener('click', () => { qty = Math.min(20, qty + 1); update(); });

  function update() {
    $('#price').textContent = $('#price2').textContent = Number(unit()).toLocaleString('en-IN');
    $('#qv').textContent = qty;
    const t = "Hi DN Car Covers, I'd like to order the DN Custom Fit Car Cover for the " + D.name + '.\nCover: Premium (waterproof, UV protected, dust proof)\nQuantity: ' + qty + '\nPrice: ' + inr(unit()) + (qty > 1 ? ' each (' + inr(unit() * qty) + ' total)' : '') + '\nPlease confirm the fit and delivery.';
    $('#order').href = wa(t); $('#order2').href = wa(t);
    $('#ask').href = wa('Hi DN Car Covers, I have a question about the cover for the ' + D.name + '.');
    wire();
  }
  update();

  const bar = $('#pbar');
  new IntersectionObserver(es => { bar.classList.toggle('show', !es[0].isIntersecting && es[0].boundingClientRect.top < 0); }).observe($('#order'));
})();
