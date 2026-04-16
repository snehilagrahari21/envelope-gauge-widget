import { jsxs as t, jsx as r } from "react/jsx-runtime";
import { cn as a } from "../../../utils/cn.js";
import { InputFieldHeader as m } from "../../forms/InputFieldHeader/InputFieldHeader.js";
import { InputFieldFooter as p } from "../../forms/InputFieldFooter/InputFieldFooter.js";
/* empty css                      */
function c({
  label: e,
  helpText: o,
  children: d,
  className: s,
  ...i
}) {
  return /* @__PURE__ */ t("div", { className: a("fds-date-selector-group", s), ...i, children: [
    e && /* @__PURE__ */ r(m, { label: e }),
    /* @__PURE__ */ t("div", { className: "fds-date-selector-group__body", children: [
      /* @__PURE__ */ r("div", { className: "fds-date-selector-group__row", children: d }),
      o && /* @__PURE__ */ r(p, { helpText: o })
    ] })
  ] });
}
c.displayName = "DateSelectorGroup";
export {
  c as DateSelectorGroup
};
