import { jsx as a, jsxs as m } from "react/jsx-runtime";
import { useRef as p, useCallback as w } from "react";
import { cn as D } from "../../../utils/cn.js";
/* empty css                 */
function v(o) {
  return Array.from(
    o.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
  );
}
function h({
  header: o,
  footer: u,
  children: c,
  className: i,
  ...d
}) {
  const l = p(null), f = w((n) => {
    const s = l.current;
    if (!s) return;
    const e = v(s);
    if (e.length === 0) return;
    const r = e.indexOf(document.activeElement);
    let t = null;
    switch (n.key) {
      case "ArrowDown":
        n.preventDefault(), t = r < e.length - 1 ? r + 1 : 0;
        break;
      case "ArrowUp":
        n.preventDefault(), t = r > 0 ? r - 1 : e.length - 1;
        break;
      case "Home":
        n.preventDefault(), t = 0;
        break;
      case "End":
        n.preventDefault(), t = e.length - 1;
        break;
      case "Enter":
      case " ":
        r >= 0 && (n.preventDefault(), e[r].click());
        break;
    }
    t !== null && e[t].focus();
  }, []);
  return /* @__PURE__ */ a("div", { className: D("fds-dropdown-menu", i), ...d, children: /* @__PURE__ */ m("div", { className: "fds-dropdown-menu__wrapper", children: [
    o,
    /* @__PURE__ */ a(
      "div",
      {
        ref: l,
        className: "fds-dropdown-menu__list",
        role: "menu",
        onKeyDown: f,
        children: c
      }
    ),
    u
  ] }) });
}
h.displayName = "DropdownMenu";
export {
  h as DropdownMenu
};
