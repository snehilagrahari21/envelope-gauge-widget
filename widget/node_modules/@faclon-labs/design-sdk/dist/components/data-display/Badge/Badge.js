import { jsxs as t, jsx as d } from "react/jsx-runtime";
import { cn as n } from "../../../utils/cn.js";
/* empty css          */
const i = {
  Small: { Subtle: "BodyXSmallMedium", Intense: "BodyXSmallRegular" },
  Medium: { Subtle: "BodySmallMedium", Intense: "BodySmallRegular" },
  Large: { Subtle: "BodySmallMedium", Intense: "BodySmallRegular" }
};
function u({
  color: s = "Positive",
  emphasis: e = "Subtle",
  size: a = "Small",
  label: o = "Label",
  leadingIcon: l,
  className: m,
  ...r
}) {
  return /* @__PURE__ */ t(
    "span",
    {
      className: n(
        "fds-badge",
        `fds-badge--color-${s.toLowerCase()}`,
        `fds-badge--emphasis-${e.toLowerCase()}`,
        `fds-badge--size-${a.toLowerCase()}`,
        i[a][e],
        m
      ),
      ...r,
      children: [
        l ? /* @__PURE__ */ d("span", { className: "fds-badge__icon", children: l }) : null,
        /* @__PURE__ */ d("span", { className: "fds-badge__label", children: o })
      ]
    }
  );
}
u.displayName = "Badge";
export {
  u as Badge
};
