import { jsx as e, jsxs as i } from "react/jsx-runtime";
import { cn as l } from "../../../utils/cn.js";
/* empty css                     */
const c = {
  Medium: "BodySmallSemibold",
  Large: "BodyMediumSemibold"
};
function f({
  label: r,
  necessityIndicator: a = "none",
  size: s = "Medium",
  trailing: d,
  htmlFor: m,
  className: n,
  ...o
}) {
  return /* @__PURE__ */ e("div", { className: l("fds-field-header", n), ...o, children: /* @__PURE__ */ i("div", { className: "fds-field-header__row", children: [
    /* @__PURE__ */ i("label", { className: l("fds-field-header__label", c[s]), htmlFor: m, children: [
      r,
      a === "required" && /* @__PURE__ */ e("span", { className: "fds-field-header__required", children: "*" })
    ] }),
    d && /* @__PURE__ */ e("div", { className: "fds-field-header__trailing", children: d })
  ] }) });
}
f.displayName = "InputFieldHeader";
export {
  f as InputFieldHeader
};
