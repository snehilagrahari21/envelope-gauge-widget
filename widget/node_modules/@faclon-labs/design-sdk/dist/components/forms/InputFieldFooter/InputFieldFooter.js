import { jsx as e, jsxs as s } from "react/jsx-runtime";
import { AlertCircle as a, CheckCircle as _ } from "react-feather";
import { cn as r } from "../../../utils/cn.js";
/* empty css                     */
const t = {
  Medium: "BodySmallRegular",
  Large: "BodyMediumRegular"
}, m = {
  Medium: 12,
  Large: 16
};
function u({
  helpText: d,
  counterText: i,
  state: o = "default",
  size: f = "Medium",
  className: c,
  ...n
}) {
  if (!d && !i) return null;
  const l = m[f];
  return /* @__PURE__ */ e("div", { className: r("fds-field-footer", c), ...n, children: /* @__PURE__ */ s("div", { className: r("fds-field-footer__row", o !== "default" && "fds-field-footer__row--center"), children: [
    d && /* @__PURE__ */ s("div", { className: "fds-field-footer__help-group", children: [
      o === "error" && /* @__PURE__ */ e("span", { className: "fds-field-footer__icon fds-field-footer__icon--error", children: /* @__PURE__ */ e(a, { size: l }) }),
      o === "success" && /* @__PURE__ */ e("span", { className: "fds-field-footer__icon fds-field-footer__icon--success", children: /* @__PURE__ */ e(_, { size: l }) }),
      /* @__PURE__ */ e("span", { className: r(`fds-field-footer__text fds-field-footer__text--${o}`, t[f]), children: d })
    ] }),
    i && /* @__PURE__ */ e("span", { className: r("fds-field-footer__counter", `fds-field-footer__counter--${o}`, "BodySmallRegular"), children: i })
  ] }) });
}
u.displayName = "InputFieldFooter";
export {
  u as InputFieldFooter
};
