import { jsx as n } from "react/jsx-runtime";
import { cn as o } from "../../../utils/cn.js";
/* empty css                         */
function l({
  trailing: i = "Icon",
  icon: r,
  children: t,
  className: a,
  ...m
}) {
  return /* @__PURE__ */ n("div", { className: o("fds-list-card-trailing", a), ...m, children: i === "Slot" ? t : r });
}
l.displayName = "ListCardTrailingItem";
export {
  l as ListCardTrailingItem
};
