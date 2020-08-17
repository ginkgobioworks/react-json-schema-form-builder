import React from "react";
import { createUseStyles } from "react-jss";
import { Collapse as RSCollapse } from "reactstrap";
import classnames from "classnames";
const useStyles = createUseStyles({
  collapseElement: {
    "& .disabled": {
      "i.toggle-collapse": {
        cursor: "default"
      }
    },
    "& h4": {
      marginTop: "7px",
      padding: "13px 10px 10px 10px"
    },
    "& i.toggle-collapse": {
      fontSize: "2.3rem",
      margin: "17px",
      cursor: "pointer",
      marginLeft: "0"
    }
  }
});

const Collapse = props => {
  const iconClasses = classnames({
    "toggle-collapse": true,
    fas: true,
    "fa-caret-down": props.isOpen,
    "fa-caret-right": !props.isOpen
  });
  const classes = classnames(`collapse-element ${props.className || ""} ${useStyles().collapseElement}`, {
    disabled: props.disableToggle
  });
  return /*#__PURE__*/React.createElement("div", {
    className: classes
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("i", {
    onClick: !props.disableToggle ? props.toggleCollapse : () => {},
    className: iconClasses
  }), /*#__PURE__*/React.createElement("h4", null, props.title)), /*#__PURE__*/React.createElement(RSCollapse, {
    isOpen: props.isOpen
  }, /*#__PURE__*/React.createElement("div", null, props.children)));
};

export default Collapse;