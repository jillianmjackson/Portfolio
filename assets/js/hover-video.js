// Plays .hover-video elements while hovered, pausing on mouse-out.
// Videos inside a .hover-video-group play and pause together when any
// part of the group is hovered.
// Touch devices can't hover, so there they play while scrolled into view.
const canHover = window.matchMedia('(hover: hover)').matches;

const play = v => v.play().catch(() => {}); // ignore interrupted-play errors

// Wrap each video in a positioned frame carrying a "Hover to play" hint.
// The frame takes over the video's layout classes and inline style (e.g.
// --ar in .media-row), so wrapping doesn't change sizes or spacing.
document.querySelectorAll('.hover-video').forEach(v => {
  const frame = document.createElement('div');
  frame.className = 'video-frame ' + [...v.classList].filter(c => c !== 'hover-video').join(' ');
  if (v.getAttribute('style')) {
    frame.setAttribute('style', v.getAttribute('style'));
    v.removeAttribute('style');
  }
  v.className = 'hover-video';
  v.replaceWith(frame);
  frame.appendChild(v);

  const hint = document.createElement('span');
  hint.className = 'video-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.textContent = '▶ Hover to play';
  frame.appendChild(hint);

  v.addEventListener('play', () => frame.classList.add('is-playing'));
  v.addEventListener('pause', () => frame.classList.remove('is-playing'));
});

// Each unit = the element that triggers playback + the videos it controls
const units = [
  ...[...document.querySelectorAll('.hover-video-group')].map(g => ({
    trigger: g,
    videos: [...g.querySelectorAll('.hover-video')],
  })),
  ...[...document.querySelectorAll('.hover-video')]
    .filter(v => !v.closest('.hover-video-group'))
    .map(v => ({ trigger: v.parentElement, videos: [v] })),
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
