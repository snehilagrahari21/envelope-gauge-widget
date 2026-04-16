import { jsxs as e, jsx as r } from "react/jsx-runtime";
import { cn as d } from "../../../utils/cn.js";
/* empty css            */
function t({
  color: n = "Brand",
  size: i = "Medium",
  label: s,
  labelPosition: a = "Bottom",
  accessibilityLabel: o = "Loading",
  className: C,
  ...l
}) {
  return /* @__PURE__ */ e(
    "div",
    {
      role: "status",
      "aria-label": o,
      className: d(
        "fds-spinner",
        `fds-spinner--color-${n.toLowerCase()}`,
        `fds-spinner--size-${i.toLowerCase()}`,
        s && `fds-spinner--label-${a.toLowerCase()}`,
        C
      ),
      ...l,
      children: [
        /* @__PURE__ */ r("div", { className: "fds-spinner__indicator", children: /* @__PURE__ */ e(
          "svg",
          {
            className: "fds-spinner__svg",
            viewBox: "0 0 22 22",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ r(
                "path",
                {
                  className: "fds-spinner__track",
                  d: "M22 11C22 17.0751 17.0751 22 11 22C4.92488 22 0 17.0751 0 11C0 4.92487 4.92488 0 11 0C17.0751 0 22 4.92487 22 11ZM2.75 11C2.75 15.5564 6.44365 19.25 11 19.25C15.5564 19.25 19.25 15.5564 19.25 11C19.25 6.44365 15.5564 2.75 11 2.75C6.44365 2.75 2.75 6.44365 2.75 11Z",
                  fill: "currentColor"
                }
              ),
              /* @__PURE__ */ r(
                "path",
                {
                  d: "M22 11C22 12.7359 21.5892 14.4472 20.8011 15.9939C20.013 17.5406 18.8701 18.8788 17.4657 19.8992C16.0613 20.9195 14.4354 21.593 12.7208 21.8646C11.0063 22.1361 9.2518 21.9981 7.60085 21.4616L8.45064 18.8462C9.68886 19.2485 11.0047 19.3521 12.2906 19.1484C13.5765 18.9448 14.796 18.4397 15.8493 17.6744C16.9026 16.9091 17.7598 15.9055 18.3508 14.7454C18.9419 13.5854 19.25 12.3019 19.25 11H22Z",
                  fill: "currentColor"
                }
              ),
              /* @__PURE__ */ r(
                "path",
                {
                  d: "M0 11C0 9.26409 0.410841 7.55282 1.19893 6.00611C1.98702 4.4594 3.12998 3.12116 4.53436 2.10081C5.93875 1.08047 7.56468 0.406986 9.27922 0.135429C10.9938 -0.136127 12.7482 0.00195318 14.3992 0.53838L13.5494 3.15378C12.3112 2.75146 10.9953 2.64791 9.70942 2.85157C8.42351 3.05524 7.20406 3.56035 6.15077 4.32561C5.09748 5.09087 4.24026 6.09455 3.6492 7.25458C3.05813 8.41461 2.75 9.69807 2.75 11H0Z",
                  fill: "currentColor"
                }
              )
            ]
          }
        ) }),
        s && /* @__PURE__ */ r("span", { className: "fds-spinner__label BodySmallRegular", children: s })
      ]
    }
  );
}
t.displayName = "Spinner";
export {
  t as Spinner
};
