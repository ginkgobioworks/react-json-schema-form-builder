import React from "react";
import classnames from "classnames";
import { createUseStyles } from "react-jss";
import FBRadioButton from "./FBRadioButton";
const useStyles = createUseStyles({
  radio: {
    "& input": {
      marginRight: "5px"
    }
  }
});
export default function FBRadioGroup(props) {
  const {
    options,
    defaultValue,
    onChange,
    horizontal,
    id,
    autoFocus,
    disabled
  } = props;
  const name = Math.random().toString();
  const classjss = useStyles();
  const classes = classnames("fb-radio-group", {
    horizontal
  });
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    className: `${classes} ${classjss.radio}`
  }, options.map((option, index) => /*#__PURE__*/React.createElement(FBRadioButton, {
    value: option.value,
    label: option.label,
    id: id,
    name: name,
    key: option.value,
    checked: option.value === defaultValue,
    autoFocus: autoFocus && index === 1,
    onChange: onChange,
    disabled: disabled
  })));
}