import * as React from "react";
import { Input } from "reactstrap"; // Input field corresponding to an array of values, add and remove

export default function CardEnumOptions({
  initialValues,
  names,
  showNames,
  onChange,
  type
}) {
  const possibleValues = [];

  for (let index = 0; index < initialValues.length; index += 1) {
    const value = initialValues[index];
    let name = `${value}`;
    if (names && index < names.length) name = names[index];
    possibleValues.push( /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "card-enum-option"
    }, /*#__PURE__*/React.createElement(Input, {
      value: value === undefined || value === null ? "" : value,
      placeholder: "Possible Value",
      key: `val-${index}`,
      type: type === "string" ? "text" : "number",
      onChange: ev => {
        let newVal;

        switch (type) {
          case "string":
            newVal = ev.target.value;
            break;

          case "number":
          case "integer":
            newVal = parseFloat(ev.target.value);
            if (Number.isInteger(newVal)) newVal = parseInt(ev.target.value, 10);
            if (Number.isNaN(newVal)) newVal = null;
            break;

          default:
            throw new Error(`Enum called with unknown type ${type}`);
        }

        onChange([...initialValues.slice(0, index), newVal, ...initialValues.slice(index + 1)], names);
      },
      className: "card-text"
    }), /*#__PURE__*/React.createElement(Input, {
      value: name || "",
      placeholder: "Name",
      key: `name-${index}`,
      type: "text",
      onChange: ev => {
        if (names) onChange(initialValues, [...names.slice(0, index), ev.target.value, ...names.slice(index + 1)]);
      },
      className: "card-text",
      style: {
        display: showNames ? "initial" : "none"
      }
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash",
      onClick: () => {
        // remove this value
        onChange([...initialValues.slice(0, index), ...initialValues.slice(index + 1)], names ? [...names.slice(0, index), ...names.slice(index + 1)] : undefined);
      }
    })));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card-enum-header"
  }, /*#__PURE__*/React.createElement("p", null, " Value "), /*#__PURE__*/React.createElement("p", {
    style: {
      display: showNames ? "initial" : "none"
    }
  }, " ", "Display Label", " ")), possibleValues, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-plus",
    onClick: () => {
      // add a new dropdown option
      onChange([...initialValues, null], names ? [...names, ""] : undefined);
    }
  }));
}