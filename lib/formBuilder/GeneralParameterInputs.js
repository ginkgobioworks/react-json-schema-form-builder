import * as React from "react";
import { getCardBody } from "./utils";
// specify the inputs required for any type of object
export default function GeneralParameterInputs({
  category,
  parameters,
  onChange,
  mods
}) {
  return /*#__PURE__*/React.createElement("div", null, getCardBody(category, mods)({
    parameters,
    onChange,
    mods
  }));
}