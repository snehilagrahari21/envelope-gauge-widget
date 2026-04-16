import { jsx as i } from "react/jsx-runtime";
import { cn as m } from "../../../utils/cn.js";
/* empty css                        */
function p({
  children: o,
  className: t,
  ...r
}) {
  return /* @__PURE__ */ i("div", { className: m("fds-action-list-group", t), role: "group", ...r, children: o });
}
p.displayName = "ActionListItemGroup";
export {
  p as ActionListItemGroup
};
