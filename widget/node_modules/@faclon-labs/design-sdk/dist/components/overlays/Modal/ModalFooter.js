import { jsxs as o, jsx as r, Fragment as l } from "react/jsx-runtime";
import { cn as t } from "../../../utils/cn.js";
import { Divider as f } from "../../layout/Divider/Divider.js";
/* empty css                */
function n({
  stacking: i = "Horizontal",
  primaryAction: e,
  secondaryAction: d,
  children: s,
  className: m,
  ...c
}) {
  const a = i === "Vertical";
  return /* @__PURE__ */ o("div", { className: t("fds-modal-footer", m), ...c, children: [
    /* @__PURE__ */ r(f, { variant: "Muted" }),
    /* @__PURE__ */ o("div", { className: t("fds-modal-footer__actions", a && "fds-modal-footer__actions--vertical"), children: [
      s && /* @__PURE__ */ r("div", { className: "fds-modal-footer__slot", children: s }),
      /* @__PURE__ */ r("div", { className: t("fds-modal-footer__stack", a && "fds-modal-footer__stack--vertical"), children: a ? /* @__PURE__ */ o(l, { children: [
        e,
        d
      ] }) : /* @__PURE__ */ o(l, { children: [
        d,
        e
      ] }) })
    ] })
  ] });
}
n.displayName = "ModalFooter";
export {
  n as ModalFooter
};
