import { jsx as t } from "react/jsx-runtime";
import { cn as d } from "../../../utils/cn.js";
/* empty css                      */
function m({
  trailing: i = "Action",
  children: a,
  className: o,
  ...r
}) {
  return /* @__PURE__ */ t(
    "div",
    {
      className: d(
        "fds-modal-trailing",
        i !== "Action" && "fds-modal-trailing--padded",
        o
      ),
      ...r,
      children: a
    }
  );
}
m.displayName = "ModalTrailingItem";
export {
  m as ModalTrailingItem
};
