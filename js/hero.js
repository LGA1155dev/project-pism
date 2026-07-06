/**
 * hero.js
 * Owns the canvas element, the frame-sequence configuration and
 * everything needed to draw a single frame onto the canvas.
 */

/* ==========================================================================
 * ⚙️ CONFIG — the ONLY place you need to change the frame count.
 * Drop your files as assets/frames/0001.webp ... NNNN.webp and update this.
 * (Currently set to 60 to match the placeholder demo frames included in
 * assets/frames — replace those with your real sequence and set this
 * to your real total, e.g. 350.)
 * ========================================================================== */
export const TOTAL_FRAMES = 60;

const FRAME_PATH = 'assets/frames';
const FRAME_EXT = 'webp';

/** Zero-pads a frame index to match the "0001.webp" naming pattern. */
function frameUrl(index) {
  const padded = String(index).padStart(4, '0');
  return `${FRAME_PATH}/${padded}.${FRAME_EXT}`;
}

export class Hero {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.frames = [];
    this.currentIndex = 0;
    this.currentScale = 1;

    this._resize = this._resize.bind(this);
    window.addEventListener('resize', this._resize, { passive: true });
    this._resize();
  }

  /** Builds the list of frame URLs. On mobile we thin the sequence out
   *  (e.g. every 2nd frame) so fewer images need to be downloaded/decoded. */
  buildFrameList() {
    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    const step = isMobile ? 2 : 1;

    const urls = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += step) {
      urls.push(frameUrl(i));
    }
    return urls;
  }

  /** Called once preload finishes. `images` is an array of loaded HTMLImageElements. */
  setFrames(images) {
    this.frames = images;
    this.drawFrame(0);
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.frames.length) this.drawFrame(this.currentIndex);
  }

  /** Draws frame at `index` covering the full canvas (like background-size: cover). */
  drawFrame(index) {
    const img = this.frames[index];
    if (!img) return;
    this.currentIndex = index;

    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const ir = img.width / img.height;
    const cr = cw / ch;

    let dw, dh, dx, dy;
    if (cr > ir) {
      dw = cw;
      dh = cw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    } else {
      dh = ch;
      dw = ch * ir;
      dy = 0;
      dx = (cw - dw) / 2;
    }

    this.ctx.clearRect(0, 0, cw, ch);
    this.ctx.drawImage(img, dx, dy, dw, dh);
  }

  /** Applies the progressive "camera enters the scene" zoom. */
  setScale(scale) {
    this.currentScale = scale;
    this.canvas.style.transform = `scale(${scale})`;
  }
}
