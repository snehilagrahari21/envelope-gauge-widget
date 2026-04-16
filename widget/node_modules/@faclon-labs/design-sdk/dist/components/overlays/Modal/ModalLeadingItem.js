import { jsx as d } from "react/jsx-runtime";
import { AlertTriangle as s, AlertCircle as m, CheckCircle as o } from "react-feather";
import { cn as r } from "../../../utils/cn.js";
/* empty css                     */
function f({
  leading: l = "Icon",
  icon: a,
  children: n,
  className: e,
  ...i
}) {
  return l === "error" ? /* @__PURE__ */ d("div", { className: r("fds-modal-leading fds-modal-leading--error", e), ...i, children: /* @__PURE__ */ d(s, { size: 16 }) }) : l === "warning" ? /* @__PURE__ */ d("div", { className: r("fds-modal-leading fds-modal-leading--warning", e), ...i, children: /* @__PURE__ */ d(m, { size: 16 }) }) : l === "success" ? /* @__PURE__ */ d("div", { className: r("fds-modal-leading fds-modal-leading--success", e), ...i, children: /* @__PURE__ */ d(o, { size: 16 }) }) : l === "Asset" ? /* @__PURE__ */ d("div", { className: r("fds-modal-leading fds-modal-leading--asset", e), ...i, children: n }) : /* @__PURE__ */ d("div", { className: r("fds-modal-leading fds-modal-leading--icon", e), ...i, children: a });
}
f.displayName = "ModalLeadingItem";
export {
  f as ModalLeadingItem
};
