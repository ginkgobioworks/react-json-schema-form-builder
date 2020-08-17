/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from "react";
import { UncontrolledTooltip } from "reactstrap";
import { createUseStyles } from "react-jss";
const typeMap = {
  alert: `fas fa-asterisk`,
  help: "fa fa-question-circle"
};
const useStyles = createUseStyles({
  toolTip: {
    color: "white",
    "background-color": "black"
  }
});
export default function Example({
  text,
  type,
  id
}) {
  const classes = useStyles();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: "underline",
      color: "blue"
    },
    href: "#",
    id: id
  }, /*#__PURE__*/React.createElement("i", {
    className: typeMap[type]
  })), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
    autohide: false,
    className: classes.toolTip,
    placement: "top",
    target: id
  }, text));
}