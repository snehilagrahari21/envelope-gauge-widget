import { jsx as n } from "react/jsx-runtime";
import { cn as a } from "../../../utils/cn.js";
/* empty css                   */
function e({
  trailing: t = "Icon",
  icon: m,
  children: o,
  className: i,
  ...r
}) {
  return t === "Icon" ? /* @__PURE__ */ n("div", { className: a("fds-pa-trailing fds-pa-trailing--icon", i), ...r, children: m }) : /* @__PURE__ */ n("div", { className: a("fds-pa-trailing", i), ...r, children: o });
}
e.displayName = "PATrailingItem";
export {
  e as PATrailingItem
};
