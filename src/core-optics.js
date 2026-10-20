/** Runtime math, independent of Three.js and browser APIs so it can be tested offline. */
export const DEFAULTS = Object.freeze({ foil: 78, glare: 55, glitter: 48, border: 66 });

export const PRESETS = Object.freeze({
  aurora: Object.freeze({ key: 'aurora', label: '全息虹彩', foil: 78, glare: 55, glitter: 48, border: 66, mode: 0 }),
  reverse: Object.freeze({ key: 'reverse', label: '局部镭射 + 闪边', foil: 70, glare: 42, glitter: 22, border: 86, mode: 1 }),
  cosmos: Object.freeze({ key: 'cosmos', label: '星砂浮雕', foil: 74, glare: 66, glitter: 82, border: 74, mode: 2 }),
});

export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

/** Clamp pointer against an element; returns normalized coordinates in [0,1]. */
export function pointerUV(clientX, clientY, rect) {
  if (!rect || rect.width <= 0 || rect.height <= 0) return { x: 0.5, y: 0.5 };
  return {
    x: clamp((clientX - rect.left) / rect.width, 0, 1),
    y: clamp(1 - (clientY - rect.top) / rect.height, 0, 1),
  };
}

/** Separate the orientation response, highlight location and foil texture shift. */
export function opticalState(pointer, maxDegrees = 13) {
  const x = clamp(pointer.x, 0, 1);
  const y = clamp(pointer.y, 0, 1);
  const nx = (x - 0.5) * 2;
  const ny = (y - 0.5) * 2;
  return {
    tiltX: -ny * maxDegrees,
    tiltY: nx * maxDegrees,
    highlightX: clamp(0.5 + nx * 0.36 - ny * 0.1, 0, 1),
    highlightY: clamp(0.5 + ny * 0.36 + nx * 0.08, 0, 1),
    foilX: nx * 0.28,
    foilY: ny * 0.22,
  };
}

export function linearResponse(current, target, elapsedSeconds, responsiveness = 10) {
  if (elapsedSeconds <= 0) return current;
  return current + (target - current) * (1 - Math.exp(-responsiveness * elapsedSeconds));
}

export function presetSettings(name) {
  const p = PRESETS[name] ?? PRESETS.aurora;
  return { foil: p.foil, glare: p.glare, glitter: p.glitter, border: p.border };
}

/** Sanitizes UI values before passing them to GPU uniforms. */
export function normControl(percent) {
  return clamp(Number.isFinite(Number(percent)) ? Number(percent) : 0, 0, 100) / 100;
}
