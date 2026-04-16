import { jsx as o } from "react/jsx-runtime";
import { cn as l } from "../../../utils/cn.js";
/* empty css              */
function e({
  bodyText: d,
  children: a,
  className: m,
  ...r
}) {
  return /* @__PURE__ */ o("div", { className: l("fds-modal-body", m), ...r, children: a ?? (d && /* @__PURE__ */ o("p", { className: "fds-modal-body__text BodyMediumRegular", children: d })) });
}
e.displayName = "ModalBody";
export {
  e as ModalBody
};
