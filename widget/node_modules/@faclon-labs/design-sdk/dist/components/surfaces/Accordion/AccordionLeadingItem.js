import { jsx as n } from "react/jsx-runtime";
/* empty css                         */
function c({
  leading: i = "None",
  icon: d,
  number: e
}) {
  return i === "None" ? null : i === "Icon" ? /* @__PURE__ */ n("div", { className: "fds-accordion-leading fds-accordion-leading--icon", children: /* @__PURE__ */ n("span", { className: "fds-accordion-leading__icon", children: d }) }) : i === "Number" ? /* @__PURE__ */ n("div", { className: "fds-accordion-leading fds-accordion-leading--number", children: /* @__PURE__ */ n("span", { className: "fds-accordion-leading__number BodyMediumMedium", children: e }) }) : null;
}
c.displayName = "AccordionLeadingItem";
export {
  c as AccordionLeadingItem
};
