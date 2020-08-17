import * as React from "react";
import { Modal, ModalHeader, Button, ModalBody, ModalFooter } from "reactstrap";
import { createUseStyles } from "react-jss";
import DependencyField from "./dependencies/DependencyField";
const useStyles = createUseStyles({
  cardModal: {
    "& .card-modal-entries": {
      padding: "1em"
    },
    "& h4, h5, p, label, li": {
      fontSize: "14px",
      marginBottom: "0"
    },
    "& h3": {
      fontSize: "16px"
    },
    "& > input": {
      marginBottom: "1em",
      height: "32px"
    },
    "& .fa-question-circle": {
      color: "var(--gray)"
    },
    "& .card-modal-boolean": {
      "& *": {
        marginRight: "0.25em",
        height: "auto",
        display: "inline-block"
      }
    },
    "& .card-modal-select": {
      "& input": {
        margin: "0",
        height: "20px"
      },
      marginBottom: "1em"
    }
  }
});
export default function CardModal({
  componentProps,
  onChange,
  isOpen,
  onClose,
  TypeSpecificParameters
}) {
  const classes = useStyles(); // assign state values for parameters that should only change on hitting "Save"

  const [componentPropsState, setComponentProps] = React.useState(componentProps);
  React.useEffect(() => {
    setComponentProps(componentProps);
  }, [componentProps]);
  return /*#__PURE__*/React.createElement(Modal, {
    isOpen: isOpen,
    "data-test": "card-modal",
    className: classes.cardModal
  }, /*#__PURE__*/React.createElement(ModalHeader, {
    className: "card-modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: componentProps.hideKey ? "none" : "initial"
    }
  }, /*#__PURE__*/React.createElement("h5", null, "Additional Settings"))), /*#__PURE__*/React.createElement(ModalBody, {
    className: "card-modal-entries"
  }, /*#__PURE__*/React.createElement(TypeSpecificParameters, {
    parameters: componentPropsState,
    onChange: newState => {
      setComponentProps({ ...componentPropsState,
        ...newState
      });
    }
  }), /*#__PURE__*/React.createElement(DependencyField, {
    parameters: componentPropsState,
    onChange: newState => {
      setComponentProps({ ...componentPropsState,
        ...newState
      });
    }
  })), /*#__PURE__*/React.createElement(ModalFooter, null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      onClose();
      onChange(componentPropsState);
    },
    color: "primary"
  }, "Save"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => {
      onClose();
    },
    color: "secondary"
  }, "Cancel")));
}