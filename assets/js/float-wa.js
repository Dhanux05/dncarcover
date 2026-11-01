/* DN Car Covers: floating WhatsApp button on every page. */
(function () {
  const C = window.CK; if (!C || document.getElementById('fwa')) return;
  const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.52.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.3 1.263.489 1.694.626.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  const css = document.createElement('style');
  css.textContent = '#fwa{position:fixed;right:18px;bottom:18px;z-index:80;display:flex;align-items:center;gap:12px;color:#fff;text-decoration:none;font-family:"Barlow Condensed",system-ui,sans-serif}' +
    '#fwa .fi{position:relative;flex:none;width:60px;height:60px;border-radius:50%;background:#25d366;display:grid;place-items:center;box-shadow:0 8px 26px rgba(37,211,102,.5);transition:transform .25s}' +
    '#fwa .fi::before{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid #25d366;animation:fwap 2s ease-out infinite}' +
    '#fwa .fi svg{width:32px;height:32px;color:#fff}#fwa:hover .fi{transform:scale(1.08)}' +
    '#fwa .ft{display:none;position:relative;flex-direction:column;line-height:1.2;text-transform:uppercase;letter-spacing:.12em;background:#fff;color:#0a0a0a;padding:10px 16px;border-radius:14px 14px 4px 14px;box-shadow:0 8px 24px rgba(0,0,0,.45);width:300px;opacity:0;transform:translateX(12px);pointer-events:none;transition:opacity .3s,transform .3s}' +
    '#fwa .ft::after{content:"";position:absolute;right:-7px;bottom:12px;border:8px solid transparent;border-left-color:#fff;border-right:0}' +
    '#fwa .ft b{font-size:16px;font-weight:800}#fwa .ft small{font-size:11.5px;font-weight:700;letter-spacing:.1em;color:#128c4a;transition:opacity .3s,transform .3s}#fwa .ft small.out{opacity:0;transform:translateY(5px)}' +
    '@media(min-width:700px){#fwa{right:28px;bottom:28px}#fwa .ft{display:flex}#fwa.open .ft,#fwa:hover .ft{opacity:1;transform:none}}' +
    '@media(max-width:699px){#fwa{bottom:84px;right:14px}#fwa .fi{width:56px;height:56px}}' +
    '@keyframes fwap{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.7);opacity:0}}' +
    '@media(prefers-reduced-motion:reduce){#fwa .fi::before{animation:none}}';
  document.head.appendChild(css);
  const a = document.createElement('a');
  a.id = 'fwa'; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'Chat with DN Car Covers on WhatsApp');
  a.href = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent("Hi DN Car Covers, I'd like to order or enquire about a cover.");
  a.innerHTML = '<span class="ft"><b>Chat with us</b><small id="fwa-l">Order your cover</small></span><span class="fi">' + ICON + '</span>';
  document.body.appendChild(a);
  /* bubble open near the top of the page and for the first few seconds, icon only after scrolling */
  const sync = () => a.classList.toggle('open', scrollY < 300);
  sync(); addEventListener('scroll', sync, { passive: true });
  /* rotating prompt */
  const el = a.querySelector('#fwa-l');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const L = ['Order your cover', 'Enquire about your car model', 'Get a quick quote', 'Ask about bike & scooter covers']; let i = 0;
    setInterval(() => { el.classList.add('out'); setTimeout(() => { i = (i + 1) % L.length; el.textContent = L[i]; el.classList.remove('out'); }, 350); }, 2800);
  }
})();
