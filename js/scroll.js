/**
 * scroll.js
 * Two responsibilities:
 *  1. Convert scroll position inside the pinned hero section into a
 *     frame index + zoom scale (scroll-scrubbing).
 *  2. Reveal generic sections (about / projects / contact) as they
 *     enter the viewport using IntersectionObserver.
 */

const SCALE_START = 1;
const SCALE_END = 2.5;

/**
 * Wires up the hero scroll-scrub. Uses rAF to throttle work to the
 * display's refresh rate, and only redraws when the target frame changes.
 */
export function bindHeroScroll({ heroSection, hero, progressFillEl }) {
  let ticking = false;

  const totalFrames = hero.frames.length;

  function update() {
    ticking = false;

    const rect = heroSection.getBoundingClientRect();
    const scrollable = heroSection.offsetHeight - window.innerHeight;
    // progress: 0 at the top of the pinned section, 1 once it fully unpins
    const raw = -rect.top / scrollable;
    const progress = Math.min(Math.max(raw, 0), 1);

    const frameIndex = Math.min(
      totalFrames - 1,
      Math.floor(progress * (totalFrames - 1))
    );
    hero.drawFrame(frameIndex);

    const scale = SCALE_START + (SCALE_END - SCALE_START) * progress;
    hero.setScale(scale);

    if (progressFillEl) progressFillEl.style.width = `${progress * 100}%`;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update(); // paint the initial state immediately
}

/**
 * Fades + slides any [data-reveal] element into view the first time
 * it crosses the viewport threshold, then stops observing it.
 */
export function bindReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  );

  els.forEach((el) => observer.observe(el));
}

/** Highlights the current section in the nav (optional nicety). */
export function bindNavHighlight() {
  const links = document.querySelectorAll('.nav__links a[data-nav]');
  if (!links.length) return;

  const sections = Array.from(links)
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`.nav__links a[data-nav="${entry.target.id}"]`);
        if (!link) return;
        link.style.opacity = entry.isIntersecting ? '1' : '';
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
}
