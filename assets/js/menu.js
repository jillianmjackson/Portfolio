// Mobile menu for deep case studies. Below 900px the sidebar becomes a
// drop-down panel opened by the .menu-toggle (hamburger) in the top nav.
// The top nav's site links are hidden on mobile, so a copy is appended
// to the panel — the top nav stays the single source of truth.
const toggle = document.querySelector('.menu-toggle');
const panel = document.getElementById(toggle?.getAttribute('aria-controls'));

if (toggle && panel) {
  const siteLinks = document.querySelector('.top-nav .nav-links');
  if (siteLinks) {
    const copy = siteLinks.cloneNode(true);
    copy.className = 'sidebar-site-links';
    panel.appendChild(copy);
  }

  const setOpen = open => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () =>
    setOpen(!document.body.classList.contains('menu-open')));

  // Close after choosing a destination, or on Escape
  panel.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  // Reset if the window is widened back to desktop while open
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
}
