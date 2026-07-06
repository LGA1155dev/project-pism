/**
 * effects.js
 * Extra interactive polish that lives outside the hero scroll-scrub:
 * custom cursor, magnetic buttons/links, 3D card tilt, split-text
 * word reveal, a cursor-reactive spotlight in the hero, and a
 * whole-page scroll progress line. Each init function is independent
 * and safely no-ops on touch devices / reduced-motion where relevant.
 */

const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------------- */
/* Custom cursor: dot follows instantly, ring trails with a lerp          */
/* ---------------------------------------------------------------------- */
export function initCursor() {
  if (!isFinePointer) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function raf() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const hoverTargets = document.querySelectorAll('a, button, [data-tilt]');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
}

/* ---------------------------------------------------------------------- */
/* Magnetic elements: gently pulled toward the cursor within their bounds */
/* ---------------------------------------------------------------------- */
export function initMagnetic() {
  if (!isFinePointer || prefersReducedMotion) return;

  const strength = 0.35;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Card tilt: subtle 3D rotation following the cursor position            */
/* ---------------------------------------------------------------------- */
export function initTilt() {
  if (!isFinePointer || prefersReducedMotion) return;

  const maxTilt = 6; // degrees
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * maxTilt * 2;
      const ry = (px - 0.5) * maxTilt * 2;
      el.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Split-text reveal: wraps words in spans, then plays a staggered rise   */
/* ---------------------------------------------------------------------- */
export function prepareSplitText() {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((word) => `<span class="split-word"><span>${word}</span></span>`)
      .join(' ');
  });
}

export function playSplitText(delayBetween = 0.04) {
  document.querySelectorAll('[data-split]').forEach((el) => {
    el.querySelectorAll('.split-word').forEach((word, i) => {
      word.querySelector('span').style.transitionDelay = `${i * delayBetween}s`;
    });
    requestAnimationFrame(() => el.classList.add('is-split-visible'));
  });
}

/* ---------------------------------------------------------------------- */
/* Hero spotlight: soft light that follows the cursor over the canvas     */
/* ---------------------------------------------------------------------- */
export function initHeroSpotlight(heroSection) {
  if (!isFinePointer) return;
  const spotlight = document.getElementById('heroSpotlight');
  if (!spotlight) return;

  heroSection.addEventListener('mouseenter', () => spotlight.classList.add('is-active'));
  heroSection.addEventListener('mouseleave', () => spotlight.classList.remove('is-active'));
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    spotlight.style.setProperty('--x', `${e.clientX - rect.left}px`);
    spotlight.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
}

/* ---------------------------------------------------------------------- */
/* Whole-page scroll progress line under the nav                          */
/* ---------------------------------------------------------------------- */
export function initTopProgress(fillEl) {
  if (!fillEl) return;

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    fillEl.style.width = `${progress * 100}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}
