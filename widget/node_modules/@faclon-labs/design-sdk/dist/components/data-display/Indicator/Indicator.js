import { jsx as d, jsxs as t } from "react/jsx-runtime";
import { cn as i } from "../../../utils/cn.js";
/* empty css              */
const m = {
  Small: "BodySmallMedium",
  Medium: "BodyMediumMedium",
  Large: "BodyMediumMedium"
};
function c({
  intent: r = "Positive",
  size: a = "Small",
  label: o,
  className: s,
  ...e
}) {
  return /* @__PURE__ */ d(
    "div",
    {
      className: i("fds-indicator", s),
      ...e,
      children: /* @__PURE__ */ t("div", { className: "fds-indicator__wrapper", children: [
        /* @__PURE__ */ d(
          "span",
          {
            className: i(
              "fds-indicator__dot",
              `fds-indicator__dot--${r.toLowerCase()}`,
              `fds-indicator__dot--${a.toLowerCase()}`
            )
          }
        ),
        o && /* @__PURE__ */ d("span", { className: i("fds-indicator__label", m[a]), children: o })
      ] })
    }
  );
}
c.displayName = "Indicator";
export {
  c as Indicator
};
