import { jsx as a } from "react/jsx-runtime";
import { cn as n } from "../../../utils/cn.js";
/* empty css                     */
const c = ["S", "M", "T", "W", "T", "F", "S"];
function i({
  days: e = c,
  className: d,
  ...s
}) {
  return /* @__PURE__ */ a("div", { className: n("fds-calendar-weekdays", d), ...s, children: e.map((l, r) => /* @__PURE__ */ a("div", { id: `day-${r}`, className: "fds-calendar-weekdays__cell", children: /* @__PURE__ */ a("span", { className: "fds-calendar-weekdays__label BodyMediumRegular", children: l }) })) });
}
i.displayName = "CalendarWeekdays";
export {
  i as CalendarWeekdays
};
