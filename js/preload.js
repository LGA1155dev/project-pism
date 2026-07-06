/**
 * preload.js
 * Loads every frame image ahead of time so scroll-scrubbing never
 * stalls on a network request. Reports progress via onProgress.
 */

/**
 * @param {string[]} urls - list of frame URLs to load
 * @param {(loaded: number, total: number) => void} onProgress
 * @returns {Promise<HTMLImageElement[]>}
 */
export function preloadFrames(urls, onProgress) {
  let loaded = 0;
  const total = urls.length;

  const loadOne = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => {
        loaded += 1;
        if (onProgress) onProgress(loaded, total);
        resolve(img); // resolve even on error so one bad frame can't block the whole sequence
      };
      img.src = src;
    });

  return Promise.all(urls.map(loadOne));
}
