function h(s, r, c) {
  const t = r / 100, i = c / 100, e = i * t, o = e * (1 - Math.abs(s / 60 % 2 - 1)), a = i - e;
  let l = 0, n = 0, u = 0;
  return s < 60 ? (l = e, n = o) : s < 120 ? (l = o, n = e) : s < 180 ? (n = e, u = o) : s < 240 ? (n = o, u = e) : s < 300 ? (l = o, u = e) : (l = e, u = o), [
    Math.round((l + a) * 255),
    Math.round((n + a) * 255),
    Math.round((u + a) * 255)
  ];
}
function b(s, r, c) {
  const t = s / 255, i = r / 255, e = c / 255, o = Math.max(t, i, e), a = Math.min(t, i, e), l = o - a;
  let n = 0;
  l !== 0 && (o === t ? n = (i - e) / l % 6 : o === i ? n = (e - t) / l + 2 : n = (t - i) / l + 4, n = Math.round(n * 60), n < 0 && (n += 360));
  const u = o === 0 ? 0 : Math.round(l / o * 100), f = Math.round(o * 100);
  return [n, u, f];
}
function g(s, r, c) {
  return `#${(16777216 + (s << 16) + (r << 8) + c).toString(16).slice(1).toUpperCase()}`;
}
function M(s) {
  const r = s.replace("#", "");
  if (r.length !== 6 && r.length !== 3) return null;
  const c = r.length === 3 ? r.split("").map((i) => i + i).join("") : r, t = parseInt(c, 16);
  return isNaN(t) ? null : [t >> 16 & 255, t >> 8 & 255, t & 255];
}
export {
  M as hexToRgb,
  h as hsbToRgb,
  g as rgbToHex,
  b as rgbToHsb
};
