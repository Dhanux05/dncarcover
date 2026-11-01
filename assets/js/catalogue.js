/* DN Car Covers — car model catalogue: search and manufacturer filter. */
(function () {
  'use strict';
  const { $, $$, wire } = window.DN;
  const cards = $$('.vc'), q = $('#q'), btns = $$('#mf button'), cnt = $('#cnt'), empty = $('#empty'), ask = $('#ask');
  let make = 'all';
  function apply() {
    const s = q.value.trim().toLowerCase().replace(/\s+/g, ' ');
    let n = 0;
    cards.forEach(c => {
      const ok = (make === 'all' || c.dataset.make === make) && (!s || c.dataset.q.includes(s) || c.dataset.q.replace(/[\s-]/g, '').includes(s.replace(/[\s-]/g, '')));
      c.hidden = !ok; if (ok) n++;
    });
    cnt.textContent = 'Showing ' + n + ' of ' + cards.length + ' cars';
    empty.hidden = n > 0;
    ask.dataset.wa = "Hi DN Car Covers, I'm looking for a car cover. My car is: " + q.value.trim();
    wire();
  }
  btns.forEach(b => b.addEventListener('click', () => { make = b.dataset.f; btns.forEach(x => x.classList.toggle('on', x === b)); apply(); }));
  q.addEventListener('input', apply);
  apply();
})();
