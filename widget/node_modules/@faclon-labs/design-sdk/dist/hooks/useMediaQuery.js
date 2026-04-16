import { useState as o, useEffect as i } from "react";
function h(e) {
  const [s, n] = o(
    () => typeof window < "u" ? window.matchMedia(e).matches : !1
  );
  return i(() => {
    const t = window.matchMedia(e), a = (c) => n(c.matches);
    return t.addEventListener("change", a), n(t.matches), () => t.removeEventListener("change", a);
  }, [e]), s;
}
export {
  h as useMediaQuery
};
