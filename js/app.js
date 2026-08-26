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

  const progress = document.querySelector('.scroll-progress');
  const glow = document.querySelector('.cursor-glow');
  const heroLines = [...document.querySelectorAll('[data-depth]')];
  const lab = document.querySelector('.scroll-lab');
  const labVisual = document.querySelector('.lab-visual');
  const labCount = document.querySelector('.lab-count span');
  const marquee = document.querySelector('.marquee > div');
  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
    glow.classList.add('active');
  }, { passive: true });
  const updateExperience = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pageProgress = max > 0 ? scrollY / max : 0;
    progress.style.transform = `scaleX(${pageProgress})`;
    heroLines.forEach((line) => { line.style.transform = `translate3d(${scrollY * Number(line.dataset.depth)}px,${scrollY * Number(line.dataset.depth) * .18}px,0)`; });
    marquee.style.transform = `translate3d(${-scrollY * .12}px,0,0)`;
    const rect = lab.getBoundingClientRect();
    const travel = lab.offsetHeight - innerHeight;
    const labProgress = Math.max(0, Math.min(1, -rect.top / Math.max(travel, 1)));
    labVisual.style.setProperty('--lab-progress', labProgress);
    labCount.textContent = String(Math.round(labProgress * 100)).padStart(2, '0');
  };
  window.addEventListener('scroll', () => requestAnimationFrame(updateExperience), { passive: true });
  updateExperience();
}
