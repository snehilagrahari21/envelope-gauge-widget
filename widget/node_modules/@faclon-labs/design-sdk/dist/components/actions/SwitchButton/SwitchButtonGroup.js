import { jsx as i } from "react/jsx-runtime";
import { cn as p } from "../../../utils/cn.js";
/* empty css                      */
function u({
  children: o,
  className: t,
  ...r
}) {
  return /* @__PURE__ */ i("div", { className: p("fds-switch-btn-group", t), role: "group", ...r, children: o });
}
u.displayName = "SwitchButtonGroup";
export {
  u as SwitchButtonGroup
};
