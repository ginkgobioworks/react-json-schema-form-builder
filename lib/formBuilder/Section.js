function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Select from "react-select";
import { createUseStyles } from "react-jss";
import { Alert, Input, UncontrolledTooltip } from "reactstrap";
import FBCheckbox from "./checkbox/FBCheckbox";
import Collapse from "./Collapse/Collapse";
import CardModal from "./CardModal";
import { CardDefaultParameterInputs } from "./defaults/DefaultInputs";
import Tooltip from "./Tooltip";
import Add from "./Add";
import { checkForUnsupportedFeatures, generateElementComponentsFromSchemas, countElementsFromSchema, addCardObj, addSectionObj, onDragEnd } from "./utils";
const useStyles = createUseStyles({
  sectionContainer: {
    "& .section-head": {
      borderBottom: "1px solid var(--gray)",
      margin: "0.5em 1.5em 0 1.5em",
      "& h5": {
        color: "black",
        fontSize: "14px",
        fontWeight: "bold",
        margin: "0"
      },
      "& .section-entry": {
        display: "inline-block",
        margin: "0",
        width: "33%",
        textAlign: "left",
        padding: "0.5em"
      },
      "& .section-reference": {
        width: "100%"
      }
    },
    "& .section-footer": {
      marginTop: "1em",
      textAlign: "center",
      i: {
        cursor: "pointer"
      }
    },
    "& .section-interactions": {
      margin: "0.5em 1.5em",
      textAlign: "left",
      borderTop: "1px solid var(--gray)",
      paddingTop: "1em",
      "& .fa": {
        marginRight: "1em",
        borderRadius: "4px",
        padding: "0.25em"
      },
      "& .fa-pencil, & .fa-arrow-up, & .fa-arrow-down": {
        border: "1px solid #1d71ad",
        color: "#1d71ad"
      },
      "& .fa-trash": {
        border: "1px solid #de5354",
        color: "#de5354"
      },
      "& .fa-arrow-up, & .fa-arrow-down": {
        marginRight: "0.5em"
      },
      "& .fb-checkbox": {
        display: "inline-block",
        label: {
          color: "#9aa4ab"
        }
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
  }
});
export default function Section({
  name,
  required,
  schema,
  uischema,
  onChange,
  onNameChange,
  onRequireToggle,
  onDependentsChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  path,
  definitionData,
  definitionUi,
  hideKey,
  reference,
  dependents,
  dependent,
  parent,
  neighborNames,
  addElem,
  cardOpen,
  setCardOpen,
  mods,
  categoryHash
}) {
  const classes = useStyles();
  const unsupportedFeatures = checkForUnsupportedFeatures(schema || {}, uischema || {}, mods);
  const schemaData = schema || {};
  const elementNum = countElementsFromSchema(schemaData);
  const defaultCollapseStates = [...Array(elementNum)].map(() => false);
  const [cardOpenArray, setCardOpenArray] = React.useState(defaultCollapseStates); // keep name in state to avoid losing focus

  const [keyName, setKeyName] = React.useState(name); // keep requirements in state to avoid rapid updates

  const [modalOpen, setModalOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Collapse, {
    isOpen: cardOpen,
    toggleCollapse: () => setCardOpen(!cardOpen),
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      onClick: () => setCardOpen(!cardOpen),
      className: "label"
    }, schemaData.title || keyName, " ", parent ? /*#__PURE__*/React.createElement(Tooltip, {
      text: `Depends on ${parent}`,
      id: `${keyName}_parentinfo`,
      type: "alert"
    }) : ""), /*#__PURE__*/React.createElement("span", {
      className: "arrows"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-up",
      id: `${path}_moveupbiginfo`,
      onClick: () => onMoveUp ? onMoveUp() : {}
    }), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      placement: "top",
      target: `${path}_moveupbiginfo`
    }, "Move form element up"), /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-down",
      id: `${path}_movedownbiginfo`,
      onClick: () => onMoveDown ? onMoveDown() : {}
    }), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
      placement: "top",
      target: `${path}_movedownbiginfo`
    }, "Move form element down"))),
    className: `section-container ${classes.sectionContainer} ${dependent ? "section-dependent" : ""} ${reference ? "section-reference" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `section-entries ${reference ? "section-reference" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, reference ? /*#__PURE__*/React.createElement("div", {
    className: "section-entry section-reference"
  }, /*#__PURE__*/React.createElement("h5", null, "Reference Section"), /*#__PURE__*/React.createElement(Select, {
    value: {
      value: reference,
      label: reference
    },
    placeholder: "Reference",
    options: Object.keys(definitionData).map(key => ({
      value: `#/definitions/${key}`,
      label: `#/definitions/${key}`
    })),
    onChange: val => {
      onChange(schema, uischema, val.value);
    },
    className: "section-select"
  })) : "", /*#__PURE__*/React.createElement("div", {
    className: "section-entry"
  }, /*#__PURE__*/React.createElement("h5", null, "Section Object Name", " ", /*#__PURE__*/React.createElement(Tooltip, {
    text: "The name that will appear in the backend of Servicely",
    id: `${keyName}_nameinfo`,
    type: "help"
  })), /*#__PURE__*/React.createElement(Input, {
    value: keyName || "",
    placeholder: "Key",
    type: "text",
    onChange: ev => setKeyName(ev.target.value.replace(/\W/g, "_")),
    onBlur: ev => onNameChange(ev.target.value),
    className: "card-text",
    readOnly: hideKey
  })), /*#__PURE__*/React.createElement("div", {
    className: "section-entry"
  }, /*#__PURE__*/React.createElement("h5", null, "Section Display Name", " ", /*#__PURE__*/React.createElement(Tooltip, {
    text: "The name Servicely will show to service requesters",
    id: `${keyName}_titleinfo`,
    type: "help"
  })), /*#__PURE__*/React.createElement(Input, {
    value: schemaData.title || "",
    placeholder: "Title",
    type: "text",
    onChange: ev => onChange({ ...schema,
      title: ev.target.value
    }, uischema),
    className: "card-text"
  })), /*#__PURE__*/React.createElement("div", {
    className: "section-entry"
  }, /*#__PURE__*/React.createElement("h5", null, "Section Description", " ", /*#__PURE__*/React.createElement(Tooltip, {
    text: "This will appear as gray text in the service request form",
    id: `${keyName}_descriptioninfo`,
    type: "help"
  })), /*#__PURE__*/React.createElement(Input, {
    value: schemaData.description || "",
    placeholder: "Description",
    type: "text",
    onChange: ev => onChange({ ...schema,
      description: ev.target.value
    }, uischema),
    className: "card-text"
  })), /*#__PURE__*/React.createElement(Alert, {
    style: {
      display: unsupportedFeatures.length === 0 ? "none" : "block"
    },
    color: "warning"
  }, /*#__PURE__*/React.createElement("h5", null, "Unsupported Features:"), unsupportedFeatures.map(message => /*#__PURE__*/React.createElement("li", {
    key: `${path}_${message}`
  }, message)))), /*#__PURE__*/React.createElement("div", {
    className: "section-body"
  }, /*#__PURE__*/React.createElement(DragDropContext, {
    onDragEnd: result => onDragEnd(result, {
      schema,
      uischema,
      onChange,
      definitionData,
      definitionUi,
      categoryHash
    }),
    className: "section-body"
  }, /*#__PURE__*/React.createElement(Droppable, {
    droppableId: "droppable"
  }, providedDroppable => /*#__PURE__*/React.createElement("div", _extends({
    ref: providedDroppable.innerRef
  }, providedDroppable.droppableProps), generateElementComponentsFromSchemas({
    schemaData: schema,
    uiSchemaData: uischema,
    onChange,
    path,
    definitionData,
    definitionUi,
    cardOpenArray,
    setCardOpenArray,
    mods,
    categoryHash
  }).map((element, index) => /*#__PURE__*/React.createElement(Draggable, {
    key: element.key,
    draggableId: element.key,
    index: index
  }, providedDraggable => /*#__PURE__*/React.createElement("div", _extends({
    ref: providedDraggable.innerRef
  }, providedDraggable.draggableProps, providedDraggable.dragHandleProps), element))), providedDroppable.placeholder)))), /*#__PURE__*/React.createElement("div", {
    className: "section-footer"
  }, /*#__PURE__*/React.createElement(Add, {
    name: `${keyName}_inner`,
    addElem: choice => {
      if (choice === "card") {
        addCardObj({
          schema,
          uischema,
          onChange,
          definitionData,
          definitionUi,
          categoryHash
        });
      } else if (choice === "section") {
        addSectionObj({
          schema,
          uischema,
          onChange,
          definitionData,
          definitionUi,
          categoryHash
        });
      }
    },
    hidden: schemaData.properties && Object.keys(schemaData.properties).length !== 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "section-interactions"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-pencil",
    id: `${path}_editinfo`,
    onClick: () => setModalOpen(true)
  }), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
    placement: "top",
    target: `${path}_editinfo`
  }, "Additional configurations for this form element"), /*#__PURE__*/React.createElement("i", {
    className: "fa fa-trash",
    id: `${path}_trashinfo`,
    onClick: () => onDelete ? onDelete() : {}
  }), /*#__PURE__*/React.createElement(UncontrolledTooltip, {
    placement: "top",
    target: `${path}_trashinfo`
  }, "Delete form element"), /*#__PURE__*/React.createElement(FBCheckbox, {
    onChangeValue: () => onRequireToggle(),
    isChecked: required,
    label: "Required",
    id: `${path}_required`
  }))), /*#__PURE__*/React.createElement(CardModal, {
    componentProps: {
      dependents,
      neighborNames,
      name: keyName,
      schema,
      type: "object"
    },
    isOpen: modalOpen,
    onClose: () => setModalOpen(false),
    onChange: newComponentProps => {
      onDependentsChange(newComponentProps.dependents);
    },
    TypeSpecificParameters: CardDefaultParameterInputs
  })), addElem ? /*#__PURE__*/React.createElement(Add, {
    name: keyName,
    addElem: choice => addElem(choice)
  }) : "");
}