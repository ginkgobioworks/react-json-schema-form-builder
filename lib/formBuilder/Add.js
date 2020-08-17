import React, { useState } from "react";
import { Popover, PopoverHeader, PopoverBody, UncontrolledTooltip, Button } from "reactstrap";
import { createUseStyles } from "react-jss";
import FBRadioGroup from "./radio/FBRadioGroup";
const useStyles = createUseStyles({
  addDetails: {
    "& .popover": {
      width: "300px",
      "& .popover-inner": {
        border: "1px solid #1d71ad",
        borderRadius: "4px",
        "& .popover-header": {
          borderBottom: "1px solid #1d71ad"
        },
        "& .popover-body": {
          "& .fb-radio-group": {
            display: "block"
          },
          "& div": {
            margin: "0",
            display: "inline-block",
            width: "50%"
          },
          "& .left": {
            textAlign: "left"
          },
          "& .right": {
            textAlign: "right"
          }
        }
      }
    }
  }
});
export default function Add({
  name,
  addElem,
  hidden
}) {
  const classes = useStyles();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [createChoice, setCreateChoice] = useState("card");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: hidden ? "none" : "initial"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-plus-square card-add",
    onClick: () => setPopoverOpen(true),
    id: `${name}_add`
  }), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
    placement: "top",
    target: `${name}_add`
  }, "Create new form element"), /*#__PURE__*/React.createElement(Popover, {
    placement: "bottom",
    target: `${name}_add`,
    isOpen: popoverOpen,
    toggle: () => setPopoverOpen(false),
    className: `add-details ${classes.addDetails}`,
    id: `${name}_add_popover`
  }, /*#__PURE__*/React.createElement(PopoverHeader, null, "Create New"), /*#__PURE__*/React.createElement(PopoverBody, null, /*#__PURE__*/React.createElement(FBRadioGroup, {
    className: "choose-create",
    defaultValue: createChoice,
    horizontal: false,
    options: [{
      value: "card",
      label: "Form element"
    }, {
      value: "section",
      label: "Form section"
    }],
    onChange: selection => {
      setCreateChoice(selection);
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "left"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setPopoverOpen(false),
    color: "secondary"
  }, "Cancel")), /*#__PURE__*/React.createElement("div", {
    className: "right"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      addElem(createChoice);
      setPopoverOpen(false);
    },
    color: "primary"
  }, "Create")))));
}