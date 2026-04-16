import { jsx as o } from "react/jsx-runtime";
import { cn as n } from "../../../utils/cn.js";
/* empty css            */
function l({
  thickness: a = "Thin",
  lineStyle: s = "Solid",
  variant: t = "Normal",
  orientation: i = "Horizontal",
  className: d,
  ...r
}) {
  const e = n(
    "fds-divider",
    `fds-divider--thickness-${a.toLowerCase()}`,
    `fds-divider--style-${s.toLowerCase()}`,
    `fds-divider--variant-${t.toLowerCase()}`,
    `fds-divider--orientation-${i.toLowerCase()}`,
    d
  );
  return i === "Vertical" ? /* @__PURE__ */ o(
    "div",
    {
      role: "separator",
      "aria-orientation": "vertical",
      className: e,
      ...r
    }
  ) : /* @__PURE__ */ o("hr", { className: e, ...r });
}
l.displayName = "Divider";
export {
  l as Divider
};
