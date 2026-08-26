const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));

if (!reduceMotion) {
  const layers = [...document.querySelectorAll('[data-parallax]')];
  let ticking = false;
  const updateParallax = () => {
    const viewportCenter = window.innerHeight / 2;
    layers.forEach((layer) => {
      const rect = layer.parentElement.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - viewportCenter) * Number(layer.dataset.parallax);
      layer.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });
  updateParallax();
}
