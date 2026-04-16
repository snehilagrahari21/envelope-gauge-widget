import { jsx as r } from "react/jsx-runtime";
import { useState as x, useCallback as f, createContext as p, useContext as C } from "react";
const s = p(null);
function w() {
  return C(s);
}
function S({
  mode: n = "single",
  defaultExpandedKeys: c = [],
  children: i,
  className: d
}) {
  const [a, l] = x(
    () => new Set(c)
  ), u = f(
    (e) => {
      l((o) => {
        if (n === "single")
          return o.has(e) ? /* @__PURE__ */ new Set() : /* @__PURE__ */ new Set([e]);
        const t = new Set(o);
        return t.has(e) ? t.delete(e) : t.add(e), t;
      });
    },
    [n]
  );
  return /* @__PURE__ */ r(s.Provider, { value: { expandedKeys: a, toggleKey: u }, children: /* @__PURE__ */ r("div", { className: d, children: i }) });
}
S.displayName = "Accordion";
export {
  S as Accordion,
  w as useAccordionContext
};
