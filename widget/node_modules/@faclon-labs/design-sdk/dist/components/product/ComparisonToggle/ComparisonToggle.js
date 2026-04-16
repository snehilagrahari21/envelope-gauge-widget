import { jsxs as l, jsx as o } from "react/jsx-runtime";
import { cn as p } from "../../../utils/cn.js";
import { ComparisonButton as s } from "./ComparisonButton.js";
/* empty css                     */
function f({
  value: t = "left",
  isDisabled: i = !1,
  onValueChange: r,
  className: m,
  ...c
}) {
  return /* @__PURE__ */ l("div", { className: p("fds-comparison-toggle", m), ...c, children: [
    /* @__PURE__ */ o(
      s,
      {
        isSelected: t === "left",
        isDisabled: i,
        className: "fds-comparison-toggle__left",
        onClick: () => r == null ? void 0 : r("left"),
        "aria-label": "Select left comparison"
      }
    ),
    /* @__PURE__ */ o(
      s,
      {
        isSelected: t === "right",
        isDisabled: i,
        className: "fds-comparison-toggle__right",
        onClick: () => r == null ? void 0 : r("right"),
        "aria-label": "Select right comparison"
      }
    )
  ] });
}
f.displayName = "ComparisonToggle";
export {
  f as ComparisonToggle
};
