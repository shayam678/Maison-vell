export const LOOKS: [number, number][] = [
  [12, 176],
  [178, 330],
  [331, 470],
  [476, 633],
  [634, 767],
  [767, 956],
];
export const Y0 = 48;
export const Y1 = 496;
export const FIRST = 15;

export const ITEMS: [number, number, number, number, string, string][] = [
  [26, 224, 28, 214, 'Feather Jacket', '$2,900'],
  [304, 412, 22, 236, 'Satin Wide Leg Trousers', '$1,450'],
  [530, 666, 12, 242, 'Pleated Dress', '$2,200'],
  [752, 922, 100, 146, 'Gold Waist Belt', '$420'],
  [70, 176, 246, 466, 'Satin Trench Dress', '$2,350'],
  [294, 422, 294, 432, 'Top Handle Bag', '$980'],
  [508, 688, 240, 452, 'Billow Sleeve Blouse', '$860'],
  [780, 890, 252, 466, 'Tie Waist Trousers', '$740'],
  [64, 178, 484, 698, 'Powder Long Coat', '$1,980'],
  [316, 396, 482, 698, 'Ivory Straight Trousers', '$690'],
  [530, 672, 508, 682, 'Sculpted Ruffle Top', '$1,120'],
  [754, 916, 484, 700, 'Pleated Maxi Skirt', '$1,340'],
];

export const KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
export const KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
export const KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
export const KB = [0, 0, 1.5, 4, 8, 12, 17];
export const KO = [1, 1, 1, 1, 0.86, 0.5, 0];

export const N = LOOKS.length;

export const wrap = (x: number, n: number): number => ((x % n) + n) % n;
export const clamp = (x: number, a: number, b: number): number =>
  Math.min(b, Math.max(a, x));

export function computeModelState(
  i: number,
  p: number,
  W: number,
  H: number,
  aspectRatio: number
) {
  const base = H * 1.2;
  let d = wrap(i - p, N);
  if (d > N - 1) d -= N;
  const k = clamp(d + 1, 0, 6);
  const a = Math.floor(k);
  const b = Math.min(6, a + 1);
  const t = k - a;
  const mix = (A: number[]) => A[a] + (A[b] - A[a]) * t;
  const h = mix(KH) * H;
  const s = h / base;
  const w = h * aspectRatio;
  const x = mix(KX) * W - w / 2;
  const y = mix(KF) * H - h;
  const f = mix(KB) / s;
  const filter = f < 0.2 ? 'none' : `blur(${f.toFixed(1)}px)`;
  const opacity = mix(KO).toFixed(3);
  const zIndex = 100 - Math.round(d * 10);
  return { d, x, y, s, filter, opacity, zIndex };
}

export function computeCardPosition(i: number, p: number, cardS: number): number {
  const all = cardS * ITEMS.length;
  let y = wrap(i * cardS - p * 2 * cardS, all);
  if (y > all - cardS) y -= all;
  return y;
}

export function stepPosition(
  p: number,
  target: number,
  dt: number,
  calm = false
): number {
  const cappedDt = Math.min(50, dt) || 16;
  let next = calm ? target : p + (target - p) * (1 - Math.exp(-cappedDt * 0.0072));
  if (Math.abs(target - next) < 0.0004) next = target;
  return next;
}
