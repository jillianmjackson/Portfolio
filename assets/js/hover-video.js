// Plays .hover-video elements while hovered, pausing on mouse-out.
// Videos inside a .hover-video-group play and pause together when any
// part of the group is hovered.
// Touch devices can't hover, so there they play while scrolled into view.
const canHover = window.matchMedia('(hover: hover)').matches;

const play = v => v.play().catch(() => {}); // ignore interrupted-play errors

// Each unit = the element that triggers playback + the videos it controls
const units = [
  ...[...document.querySelectorAll('.hover-video-group')].map(g => ({
    trigger: g,
    videos: [...g.querySelectorAll('.hover-video')],
  })),
  ...[...document.querySelectorAll('.hover-video')]
    .filter(v => !v.closest('.hover-video-group'))
    .map(v => ({ trigger: v, videos: [v] })),
];

const start = unit => unit.videos.forEach(play);
const stop = unit => unit.videos.forEach(v => v.pause());

if (canHover) {
  units.forEach(unit => {
    unit.trigger.addEventListener('mouseenter', () => start(unit));
    unit.trigger.addEventListener('mouseleave', () => stop(unit));
  });
} else {
  const byTrigger = new Map(units.map(u => [u.trigger, u]));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const unit = byTrigger.get(entry.target);
      if (entry.isIntersecting) start(unit);
      else stop(unit);
    });
  }, { threshold: 0.5 });

  units.forEach(u => observer.observe(u.trigger));
}
