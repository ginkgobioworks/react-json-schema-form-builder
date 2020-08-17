import * as React from "react";
import { UncontrolledTooltip } from "reactstrap";
import { createUseStyles } from "react-jss";
import FBCheckbox from "./checkbox/FBCheckbox";
import Collapse from "./Collapse/Collapse";
import CardModal from "./CardModal";
import CardGeneralParameterInputs from "./CardGeneralParameterInputs";
import Add from "./Add";
import Tooltip from "./Tooltip";
const useStyles = createUseStyles({
  cardEntries: {
    "border-bottom": "1px solid gray",
    margin: ".5em 1.5em 0 1.5em",
    "& h5": {
      color: "black",
      "font-size": "14px",
      "font-weight": "bold",
      margin: 0
    },
    "& .card-entry": {
      display: "inline-block",
      margin: 0,
      width: "50%",
      "text-align": "left",
      padding: "0.5em"
    },
    "& input": {
      border: "1px solid gray",
      "border-radius": "4px"
    },
    "& .card-category-options": {
      padding: ".5em"
    },
    "& .card-select": {
      border: "1px solid var(--gray)",
      "border-radius": "4px"
    },
    "& .card-array": {
      "& .fa-plus-square": {
        display: "none"
      }
    },
    "& .card-enum": {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      backgroundColor: "var(--light-gray)",
      textAlign: "left",
      padding: "1em",
      "& h3": {
        fontSize: "16px",
        margin: "0"
      },
      "& label": {
        color: "black",
        fontSize: "14px"
      },
      "& .card-enum-header": {
        marginTop: "0.5em",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        "& h5": {
          width: "50%",
          fontWeight: "bold",
          fontSize: "14px"
        }
      },
      "& i": {
        cursor: "pointer"
      },
      "& .card-enum-option": {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        "& input": {
          width: "80%",
          marginRight: "1em",
          marginBottom: "0.5em"
        }
      }
    }
  },
  cardInteractions: {
    margin: ".5em 1.5em",
    textAlign: "left",
    "& .fa": {
      marginRight: "1em",
      borderRadius: "4px",
      padding: ".25em"
    },
    "& .fa-arrow-up, .fa-arrow-down": {
      marginRight: ".5em"
    },
    "& .fa-trash": {
      border: "1px solid #DE5354",
      color: "#DE5354"
    },
    "& .fb-checkbox": {
      display: "inline-block"
    },
    "& .interactions-left, & .interactions-right": {
      display: "inline-block",
      width: "48%",
      margin: "0 auto"
    },
    "& .interactions-left": {
      textAlign: "left"
    },
    "& .interactions-right": {
      textAlign: "right"
    }
  }
});
export default function Card({
  componentProps,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  TypeSpecificParameters,
  addElem,
  cardOpen,
  setCardOpen,
  mods
}) {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Collapse, {
    isOpen: cardOpen,
    toggleCollapse: () => setCardOpen(!cardOpen),
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      onClick: () => setCardOpen(!cardOpen),
      className: "label"
    }, componentProps.title || componentProps.name, " ", componentProps.parent ? /*#__PURE__*/React.createElement(Tooltip, {
      text: `Depends on ${componentProps.parent}`,
      id: `${componentProps.path}_parentinfo`,
      type: "alert"
    }) : "", componentProps.$ref !== undefined ? /*#__PURE__*/React.createElement(Tooltip, {
      text: `Is an instance of pre-configured component ${componentProps.$ref}`,
      id: `${componentProps.path}_refinfo`,
      type: "alert"
    }) : ""), /*#__PURE__*/React.createElement("span", {
      className: "arrows"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-up",
      id: `${componentProps.path}_moveupbiginfo`,
      onClick: () => onMoveUp ? onMoveUp() : {}
    }), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      placement: "top",
      target: `${componentProps.path}_moveupbiginfo`
    }, "Move form element up"), /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-down",
      id: `${componentProps.path}_movedownbiginfo`,
      onClick: () => onMoveDown ? onMoveDown() : {}
    }), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      placement: "top",
      target: `${componentProps.path}_movedownbiginfo`
    }, "Move form element down"))),
    className: `card-container ${componentProps.dependent ? "card-dependent" : ""} ${componentProps.$ref === undefined ? "" : "card-reference"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.cardEntries
  }, /*#__PURE__*/React.createElement(CardGeneralParameterInputs, {
    parameters: componentProps,
    onChange: onChange,
    mods: mods
  })), /*#__PURE__*/React.createElement("div", {
    className: classes.cardInteractions
  }, /*#__PURE__*/React.createElement("i", {
    id: `${componentProps.path}_editinfo`,
    className: "fa fa-pencil",
    onClick: () => setModalOpen(true)
  }), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
    placement: "top",
    target: `${componentProps.path}_editinfo`
  }, "Additional configurations for this form element"), /*#__PURE__*/React.createElement("i", {
    className: "fa fa-trash",
    id: `${componentProps.path}_trashinfo`,
    onClick: onDelete || (() => {})
  }), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
    placement: "top",
    target: `${componentProps.path}_trashinfo`
  }, "Delete form element"), /*#__PURE__*/React.createElement(FBCheckbox, {
    onChangeValue: () => onChange({ ...componentProps,
      required: !componentProps.required
    }),
    isChecked: !!componentProps.required,
    label: "Required",
    id: `${typeof componentProps.path === "string" ? componentProps.path : "card"}_required`
  })), /*#__PURE__*/React.createElement(CardModal, {
    componentProps: componentProps,
    isOpen: modalOpen,
    onClose: () => setModalOpen(false),
    onChange: newComponentProps => {
      onChange(newComponentProps);
    },
    TypeSpecificParameters: TypeSpecificParameters
  })), addElem ? /*#__PURE__*/React.createElement(Add, {
    name: `${componentProps.path}`,
    addElem: choice => addElem(choice)
  }) : "");
}