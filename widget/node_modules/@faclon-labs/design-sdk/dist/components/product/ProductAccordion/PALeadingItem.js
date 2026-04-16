import { jsx as e } from "react/jsx-runtime";
import { cn as a } from "../../../utils/cn.js";
/* empty css                  */
function f({
  leading: i = "Icon",
  icon: r,
  number: m,
  children: l,
  className: n,
  ...d
}) {
  return i === "None" ? null : i === "Number" ? /* @__PURE__ */ e("div", { className: a("fds-pa-leading fds-pa-leading--number", n), ...d, children: /* @__PURE__ */ e("span", { className: "fds-pa-leading__number BodyMediumMedium", children: m }) }) : i === "Slot" ? /* @__PURE__ */ e("div", { className: a("fds-pa-leading", n), ...d, children: l }) : /* @__PURE__ */ e("div", { className: a("fds-pa-leading fds-pa-leading--icon", n), ...d, children: r });
}
f.displayName = "PALeadingItem";
export {
  f as PALeadingItem
};
