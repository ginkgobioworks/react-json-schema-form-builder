import * as React from "react";
import Tooltip from "../Tooltip"; // warning message if not all possibilities specified

export default function DependencyWarning({
  parameters
}) {
  if (parameters.enum && parameters.dependents && parameters.dependents.length && parameters.dependents[0].value) {
    // get the set of defined enum values
    const definedVals = new Set([]);
    parameters.dependents.forEach(possibility => {
      if (possibility.value && possibility.value.enum) possibility.value.enum.forEach(val => definedVals.add(val));
    });
    const undefinedVals = [];
    if (Array.isArray(parameters.enum)) parameters.enum.forEach(val => {
      if (!definedVals.has(val)) undefinedVals.push(val);
    });
    if (undefinedVals.length === 0) return null;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "Warning! The following values do not have associated dependency values:", " ", /*#__PURE__*/React.createElement(Tooltip, {
      id: `${parameters.path}_valuewarning`,
      type: "help",
      text: "Each possible value for a value-based dependency must be defined to work properly"
    })), /*#__PURE__*/React.createElement("ul", null, undefinedVals.map(val => /*#__PURE__*/React.createElement("li", null, val))));
  }

  return null;
}