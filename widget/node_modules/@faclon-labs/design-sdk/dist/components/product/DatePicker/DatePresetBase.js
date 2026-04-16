import { jsx as t } from "react/jsx-runtime";
import { cn as d } from "../../../utils/cn.js";
/* empty css                   */
function p({
  label: s,
  isSelected: e = !1,
  className: a,
  ...r
}) {
  return /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: d(
        "fds-date-preset",
        e && "fds-date-preset--selected",
        a
      ),
      "aria-pressed": e,
      ...r,
      children: /* @__PURE__ */ t("span", { className: "fds-date-preset__label BodyMediumRegular", children: s })
    }
  );
}
p.displayName = "DatePresetBase";
export {
  p as DatePresetBase
};
