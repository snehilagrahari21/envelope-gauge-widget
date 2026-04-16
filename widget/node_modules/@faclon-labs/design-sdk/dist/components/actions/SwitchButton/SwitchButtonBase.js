import { jsxs as d, jsx as o } from "react/jsx-runtime";
import { cn as r } from "../../../utils/cn.js";
/* empty css                     */
function f({
  type: t = "Icon",
  isActive: s = !1,
  isDisabled: n = !1,
  label: c,
  icon: i,
  className: e,
  ...a
}) {
  return /* @__PURE__ */ d(
    "button",
    {
      disabled: n,
      "aria-pressed": s,
      className: r(
        "fds-switch-btn",
        t === "Icon" ? "fds-switch-btn--icon" : "fds-switch-btn--text",
        s && "fds-switch-btn--active",
        n && "fds-switch-btn--disabled",
        e
      ),
      ...a,
      children: [
        t === "Icon" && i,
        t === "Text" && /* @__PURE__ */ o("span", { className: "fds-switch-btn__label BodyMediumSemibold", children: c })
      ]
    }
  );
}
f.displayName = "SwitchButtonBase";
export {
  f as SwitchButtonBase
};
