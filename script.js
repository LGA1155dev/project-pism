/**
 * script.js
 * Application entry point. Keeps orchestration only — all real logic
 * lives in the js/ modules so each file has a single responsibility.
 */
import { Hero } from './js/hero.js';
import { preloadFrames } from './js/preload.js';
import { bindHeroScroll, bindReveal, bindNavHighlight } from './js/scroll.js';
import {
  initCursor,
  initMagnetic,
  initTilt,
  prepareSplitText,
  playSplitText,
  initHeroSpotlight,
  initTopProgress,
} from './js/effects.js';

const loaderEl = document.getElementById('loader');
const loaderProgressEl = document.getElementById('loaderProgress');
const loaderPctEl = document.getElementById('loaderPct');

const heroSection = document.getElementById('hero');
const heroCanvas = document.getElementById('heroCanvas');
const heroProgressFillEl = document.getElementById('heroProgressFill');
const topProgressFillEl = document.getElementById('topProgressFill');

// split hero text into words up front so there is no layout flash
prepareSplitText();

async function init() {
  const hero = new Hero(heroCanvas);
  const urls = hero.buildFrameList();

  const images = await preloadFrames(urls, (loaded, total) => {
    const pct = Math.round((loaded / total) * 100);
    loaderProgressEl.style.width = `${pct}%`;
    loaderPctEl.textContent = `${pct}%`;
  });

  hero.setFrames(images);

  bindHeroScroll({ heroSection, hero, progressFillEl: heroProgressFillEl });
  bindReveal();
  bindNavHighlight();

  initCursor();
  initMagnetic();
  initTilt();
  initHeroSpotlight(heroSection);
  initTopProgress(topProgressFillEl);

  loaderEl.classList.add('is-hidden');
  playSplitText();
}

init();
