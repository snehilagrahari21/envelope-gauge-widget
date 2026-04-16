import { jsx as a } from "react/jsx-runtime";
import { cn as s } from "../../../utils/cn.js";
/* empty css                       */
function d({
  label: l,
  isActive: e = !1,
  isDisabled: t = !1,
  className: o,
  ...r
}) {
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: s(
        "fds-date-selector-btn",
        e && "fds-date-selector-btn--active",
        t && "fds-date-selector-btn--disabled",
        o
      ),
      disabled: t,
      "aria-pressed": e,
      ...r,
      children: /* @__PURE__ */ a("span", { className: "fds-date-selector-btn__label BodySmallSemibold", children: l })
    }
  );
}
d.displayName = "DateSelectorButton";
export {
  d as DateSelectorButton
};
