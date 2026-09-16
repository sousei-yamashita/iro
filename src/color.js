const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const LIGHTNESS_STEP = 0.05;
export const TINT_RATE = 0.15;
export const GAMUT_ITERATIONS = 24;

export const BASE_COLORS = Object.freeze({
  red: Object.freeze({ name: "赤", color: Object.freeze({ l: 0.63, c: 0.22, h: 28 }) }),
  orange: Object.freeze({ name: "オレンジ", color: Object.freeze({ l: 0.75, c: 0.17, h: 58 }) }),
  yellow: Object.freeze({ name: "黄", color: Object.freeze({ l: 0.9, c: 0.16, h: 95 }) }),
  green: Object.freeze({ name: "緑", color: Object.freeze({ l: 0.67, c: 0.17, h: 145 }) }),
  blue: Object.freeze({ name: "青", color: Object.freeze({ l: 0.6, c: 0.18, h: 250 }) }),
  purple: Object.freeze({ name: "紫", color: Object.freeze({ l: 0.58, c: 0.2, h: 305 }) }),
  pink: Object.freeze({ name: "ピンク", color: Object.freeze({ l: 0.78, c: 0.13, h: 350 }) }),
  brown: Object.freeze({ name: "茶", color: Object.freeze({ l: 0.5, c: 0.1, h: 55 }) })
});

export function normalizeHue(hue) {
  return ((Number.isFinite(hue) ? hue : 0) % 360 + 360) % 360;
}

export function canonicalize(color) {
  return {
    l: clamp(Number.isFinite(color.l) ? color.l : 0, 0, 1),
    c: Math.max(0, Number.isFinite(color.c) ? color.c : 0),
    h: normalizeHue(color.h)
  };
}

export function changeLightness(color, amount) {
  const current = canonicalize(color);
  return { ...current, l: clamp(current.l + amount, 0, 1) };
}

export function moveToward(color, target, rate = TINT_RATE) {
  const current = canonicalize(color);
  const goal = canonicalize(target);
  const delta = ((goal.h - current.h + 540) % 360) - 180;
  return canonicalize({
    l: current.l,
    c: current.c + (goal.c - current.c) * rate,
    h: current.h + delta * rate
  });
}

function linearSrgb(color) {
  const h = normalizeHue(color.h) * Math.PI / 180;
  const a = color.c * Math.cos(h);
  const b = color.c * Math.sin(h);
  const l_ = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = color.l - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ];
}

function isInGamut(color) {
  return linearSrgb(color).every(channel => Number.isFinite(channel) && channel >= 0 && channel <= 1);
}

export function mapToSrgbGamut(color) {
  const current = canonicalize(color);
  if (isInGamut(current)) return current;
  let low = 0;
  let high = current.c;
  for (let index = 0; index < GAMUT_ITERATIONS; index += 1) {
    const middle = (low + high) / 2;
    if (isInGamut({ ...current, c: middle })) low = middle;
    else high = middle;
  }
  return { ...current, c: low };
}

function encodeSrgb(channel) {
  const encoded = channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * channel ** (1 / 2.4) - 0.055;
  return clamp(Math.round(encoded * 255), 0, 255);
}

export function toHex(color) {
  return `#${linearSrgb(mapToSrgbGamut(color))
    .map(encodeSrgb)
    .map(channel => channel.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}
