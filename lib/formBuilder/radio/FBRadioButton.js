import React from "react";
import classnames from "classnames";
export default function FBRadioButton(props) {
  const {
    label,
    value,
    checked,
    name,
    onChange,
    required,
    disabled,
    autoFocus
  } = props;
  const classes = classnames("fb-radio-button", {
    disabled
  });
  return /*#__PURE__*/React.createElement("label", {
    className: classes,
    key: value
  }, props.children, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    required: required,
    disabled: disabled,
    autoFocus: autoFocus,
    onChange: () => onChange(value)
  }), /*#__PURE__*/React.createElement("span", {
    className: "fb-custom-radio-button"
  }), label);
}