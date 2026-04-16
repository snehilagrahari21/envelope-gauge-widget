import { useEffect as u } from "react";
function f(e, t, r = !0) {
  u(() => {
    if (!r) return;
    const n = (o) => {
      o.key === e && t(o);
    };
    return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
  }, [e, t, r]);
}
export {
  f as useKeyboard
};
