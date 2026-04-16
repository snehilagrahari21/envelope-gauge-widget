import { jsx as i } from "react/jsx-runtime";
import { cn as a } from "../../../utils/cn.js";
/* empty css                        */
function s({
  leading: t = "Icon",
  icon: l,
  children: n,
  color: e,
  className: d,
  ...r
}) {
  return t === "Color" ? /* @__PURE__ */ i("div", { className: a("fds-list-card-leading", d), ...r, children: /* @__PURE__ */ i(
    "span",
    {
      className: "fds-list-card-leading__color",
      style: e ? { backgroundColor: e } : void 0
    }
  ) }) : t === "Slot" ? /* @__PURE__ */ i("div", { className: a("fds-list-card-leading", d), ...r, children: n }) : /* @__PURE__ */ i("div", { className: a("fds-list-card-leading", d), ...r, children: l });
}
s.displayName = "ListCardLeadingItem";
export {
  s as ListCardLeadingItem
};
