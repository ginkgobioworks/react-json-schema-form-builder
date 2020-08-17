import * as React from "react";
import Tooltip from "../Tooltip";
import CardSelector from "./CardSelector";
import ValueSelector from "./ValueSelector"; // a possible dependency

export default function DependencyPossibility({
  possibility,
  neighborNames,
  path,
  onChange,
  onDelete,
  parentEnums,
  parentType,
  parentName,
  parentSchema
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "form-dependency-condition"
  }, /*#__PURE__*/React.createElement("h5", null, "Display the following:", " ", /*#__PURE__*/React.createElement(Tooltip, {
    id: `${path}_bulk`,
    type: "help",
    text: "Choose the other form elements that depend on this one"
  })), /*#__PURE__*/React.createElement(CardSelector, {
    possibleChoices: neighborNames.filter(name => name !== parentName) || [],
    chosenChoices: possibility.children,
    onChange: chosenChoices => onChange({ ...possibility,
      children: [...chosenChoices]
    }),
    placeholder: "Choose a dependent...",
    path: path
  }), /*#__PURE__*/React.createElement("h5", null, "If '", parentName, "'' has ", possibility.value ? "the value:" : "a value."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: possibility.value ? "initial" : "none"
    }
  }, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(ValueSelector, {
    possibility: possibility,
    onChange: newPossibility => onChange(newPossibility),
    parentEnums: parentEnums,
    parentType: parentType,
    parentName: parentName,
    parentSchema: parentSchema,
    path: path
  })), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("i", {
    className: "fa fa-times",
    onClick: () => onDelete()
  }));
}