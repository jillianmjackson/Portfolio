// Highlights the active sidebar link as the reader scrolls through sections
const sections = document.querySelectorAll('.main [id]');
const navLinks = document.querySelectorAll('#sidebar-nav a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`#sidebar-nav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));
