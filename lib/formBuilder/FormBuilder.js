function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Alert, Input } from "reactstrap";
import { createUseStyles } from "react-jss";
import Add from "./Add";
import { parse, stringify, checkForUnsupportedFeatures, generateElementComponentsFromSchemas, addCardObj, addSectionObj, onDragEnd, countElementsFromSchema, generateCategoryHash } from "./utils";
const useStyles = createUseStyles({
  formBuilder: {
    "text-align": "center",
    "& i": {
      cursor: "pointer"
    },
    "& .fa-question-circle": {
      color: "gray"
    },
    "& .fa-asterisk": {
      "font-size": ".9em",
      color: "green"
    },
    "& .fa-plus-square": {
      color: "green",
      "font-size": "1.5em",
      margin: "0 auto"
    },
    "& .card-container": {
      "&:hover": {
        border: "1px solid green"
      },
      display: "block",
      width: "70%",
      "min-width": "400px",
      margin: "2em auto",
      border: "1px solid gray",
      "border-radius": "4px",
      "background-color": "white",
      "& .toggle-collapse": {
        margin: "0.25em .5em 0 .5em !important"
      },
      "& h4": {
        width: "100%",
        "text-align": "left",
        display: "inline-block",
        color: "#138AC2",
        margin: "0.25em .5em 0 .5em",
        "font-size": "18px"
      },
      "& .d-flex": {
        "border-bottom": "1px solid gray"
      },
      "& .label": {
        float: "left"
      },
      "& .arrows": {
        "text-align": "right",
        float: "right",
        "& .fa-trash": {
          border: "1px solid #DE5354",
          color: "#DE5354"
        },
        "& .fa": {
          "border-radius": "4px",
          padding: ".25em",
          margin: "0 .5em 0 0"
        }
      }
    },
    "& .card-dependent": {
      border: "1px dashed gray"
    },
    "& .card-requirements": {
      border: "1px dashed black"
    },
    "& .section-container": {
      "&:hover": {
        border: "1px solid green"
      },
      display: "block",
      width: "90%",
      "min-width": "400px",
      margin: "2em auto",
      border: "1px solid var(--gray)",
      "border-radius": "4px",
      "background-color": "white",
      "& .toggle-collapse": {
        margin: "0.25em .5em 0 .5em !important"
      },
      "& h4": {
        width: "100%",
        "text-align": "left",
        display: "inline-block",
        color: "#138AC2",
        margin: "0.25em .5em 0 .5em",
        "font-size": "18px"
      },
      "& .d-flex": {
        "border-bottom": "1px solid var(--gray)"
      },
      "& .label": {
        float: "left"
      },
      "& .arrows": {
        "text-align": "right",
        float: "right",
        "& .fa-trash": {
          border: "1px solid #DE5354",
          color: "#DE5354"
        },
        "& .fa": {
          "border-radius": "4px",
          padding: ".25em",
          margin: "0 .5em 0 0"
        }
      }
    },
    "& .section-dependent": {
      border: "1px dashed gray"
    },
    "& .section-requirements": {
      border: "1px dashed black"
    },
    "& .alert": {
      textAlign: "left",
      width: "70%",
      margin: "1em auto",
      "& h5": {
        color: "black",
        fontSize: "16px",
        fontWeight: "bold",
        margin: "0"
      },
      "& li": {
        fontSize: "14px"
      }
    },
    "& .disabled-unchecked-checkbox": {
      color: "var(--gray)",
      "& div::before": {
        backgroundColor: "var(--light-gray)"
      }
    },
    "& .disabled-input": {
      "& input": {
        backgroundColor: "var(--light-gray)"
      },
      "& input:focus": {
        backgroundColor: "var(--light-gray)",
        border: "1px solid var(--gray)"
      }
    }
  },
  formHead: {
    display: "block",
    margin: "0 auto",
    "background-color": "#EBEBEB",
    border: "1px solid #858F96",
    "border-radius": "4px",
    width: "70%",
    padding: "10px",
    "& div": {
      width: "30%",
      display: "inline-block",
      "text-align": "left",
      padding: "10px"
    },
    "& .form-title": {
      "text-align": "left"
    },
    "& .form-description": {
      "text-align": "left"
    },
    "& h5": {
      "font-size": "14px",
      "line-height": "21px",
      "font-weight": "bold"
    }
  },
  formBody: {
    display: "flex",
    "flex-direction": "column",
    "& .fa-pencil, & .fa-arrow-up, & .fa-arrow-down": {
      border: "1px solid #1d71ad",
      color: "#1d71ad"
    },
    "& .modal-body": {
      maxHeight: "500px",
      overflowY: "scroll"
    },
    "& .card-container": {
      width: "70%",
      minWidth: "400px",
      margin: "2em auto",
      border: "1px solid var(--gray)",
      borderRadius: "4px",
      backgroundColor: "white",
      "& .toggle-collapse": {
        margin: "0.25em 0.5em 0 0.5em !important"
      },
      "& h4": {
        width: "100%",
        textAlign: ["left", "left"],
        display: "inline-block",
        color: "#138ac2",
        margin: "0.25em 0.5em 0 0.5em",
        fontSize: "18px"
      },
      "& .d-flex": {
        borderBottom: "1px solid var(--gray)"
      },
      "& .label": {
        cssFloat: "left"
      },
      "& .arrows": {
        textAlign: "right",
        cssFloat: "right",
        "& .fa-trash": {
          border: "1px solid #de5354",
          color: "#de5354"
        },
        "& .fa": {
          borderRadius: "4px",
          padding: "0.25em",
          margin: "0 0.5em 0 0"
        }
      }
    },
    "& .card-container:hover": {
      border: "1px solid var(--green)"
    },
    "& .card-dependent": {
      border: "1px dashed var(--gray)"
    },
    "& .card-add": {
      cursor: "pointer",
      display: "block",
      color: "$green",
      fontSize: "1.5em"
    },
    "& .section-container": {
      width: "90%",
      minWidth: "400px",
      margin: "2em auto",
      border: "1px solid var(--gray)",
      borderRadius: "4px",
      "& .toggle-collapse": {
        margin: "0.25em 0.5em 0 0.5em !important"
      },
      "& h4": {
        width: "100%",
        textAlign: ["left", "left"],
        display: "inline-block",
        color: "#138ac2",
        margin: "0.25em 0.5em 0 0.5em",
        fontSize: "18px"
      },
      "& .d-flex": {
        borderBottom: "1px solid var(--gray)"
      },
      "& .label": {
        cssFloat: "left"
      },
      "& .arrows": {
        textAlign: "right",
        cssFloat: "right",
        "& .fa-trash": {
          border: "1px solid #de5354",
          color: "#de5354"
        },
        "& .fa": {
          borderRadius: "4px",
          padding: "0.25em",
          margin: "0 0.5em 0 0"
        }
      }
    },
    "& .section-container:hover": {
      border: "1px solid var(--green)"
    },
    "& .section-dependent": {
      border: "1px dashed var(--gray)"
    },
    "& .section-requirements": {
      border: "1px dashed black"
    }
  },
  formFooter: {
    marginTop: "1em",
    textAlign: "center",
    "& i": {
      cursor: "pointer",
      color: "$green",
      fontSize: "1.5em"
    }
  }
});
export default function FormBuilder({
  schema,
  uischema,
  onChange,
  lang,
  mods,
  className
}) {
  const classes = useStyles();
  const schemaData = parse(schema, lang) || {};
  schemaData.type = "object";
  const uiSchemaData = parse(uischema, lang) || {};
  const unsupportedFeatures = checkForUnsupportedFeatures(schemaData, uiSchemaData, mods);
  const elementNum = countElementsFromSchema(schemaData);
  const defaultCollapseStates = [...Array(elementNum)].map(() => false);
  const [cardOpenArray, setCardOpenArray] = React.useState(defaultCollapseStates);
  const categoryHash = generateCategoryHash(mods);
  return /*#__PURE__*/React.createElement("div", {
    className: `${classes.formBuilder} ${className || ""}`
  }, /*#__PURE__*/React.createElement("link", {
    rel: "stylesheet",
    href: "https://use.fontawesome.com/releases/v5.11.2/css/all.css"
  }), /*#__PURE__*/React.createElement("link", {
    rel: "stylesheet",
    href: "https://use.fontawesome.com/releases/v5.11.2/css/v4-shims.css"
  }), /*#__PURE__*/React.createElement(Alert, {
    style: {
      display: unsupportedFeatures.length === 0 ? "none" : "block"
    },
    color: "warning"
  }, /*#__PURE__*/React.createElement("h5", null, "Unsupported Features:"), unsupportedFeatures.map((message, index) => /*#__PURE__*/React.createElement("li", {
    key: index
  }, message))), /*#__PURE__*/React.createElement("div", {
    className: classes.formHead
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, "Form Name"), /*#__PURE__*/React.createElement(Input, {
    value: schemaData.title || "",
    placeholder: "Title",
    type: "text",
    onChange: ev => {
      onChange(stringify({ ...schemaData,
        title: ev.target.value
      }, lang), uischema);
    },
    className: "form-title"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, "Form Description"), /*#__PURE__*/React.createElement(Input, {
    value: schemaData.description || "",
    placeholder: "Description",
    type: "text",
    onChange: ev => onChange(stringify({ ...schemaData,
      description: ev.target.value
    }, lang), uischema),
    className: "form-description"
  }))), /*#__PURE__*/React.createElement("div", {
    className: `form-body ${classes.formBody}`
  }, /*#__PURE__*/React.createElement(DragDropContext, {
    onDragEnd: result => onDragEnd(result, {
      schema: schemaData,
      uischema: uiSchemaData,
      onChange: (newSchema, newUiSchema) => onChange(stringify(newSchema, lang), stringify(newUiSchema, lang)),
      definitionData: schemaData.definitions,
      definitionUi: uiSchemaData.definitions,
      categoryHash
    }),
    className: "form-body"
  }, /*#__PURE__*/React.createElement(Droppable, {
    droppableId: "droppable"
  }, providedDroppable => /*#__PURE__*/React.createElement("div", _extends({
    ref: providedDroppable.innerRef
  }, providedDroppable.droppableProps), generateElementComponentsFromSchemas({
    schemaData,
    uiSchemaData,
    onChange: (newSchema, newUiSchema) => onChange(stringify(newSchema, lang), stringify(newUiSchema, lang)),
    definitionData: schemaData.definitions,
    definitionUi: uiSchemaData.definitions,
    path: "root",
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
    className: `form-footer ${classes.formFooter}`
  }, /*#__PURE__*/React.createElement(Add, {
    name: `form-builder`,
    addElem: choice => {
      if (choice === "card") {
        addCardObj({
          schema: schemaData,
          uischema: uiSchemaData,
          onChange: (newSchema, newUiSchema) => onChange(stringify(newSchema, lang), stringify(newUiSchema, lang)),
          definitionData: schemaData.definitions,
          definitionUi: uiSchemaData.definitions,
          categoryHash
        });
      } else if (choice === "section") {
        addSectionObj({
          schema: schemaData,
          uischema: uiSchemaData,
          onChange: (newSchema, newUiSchema) => onChange(stringify(newSchema, lang), stringify(newUiSchema, lang)),
          definitionData: schemaData.definitions,
          definitionUi: uiSchemaData.definitions,
          categoryHash
        });
      }
    },
    hidden: schemaData.properties && Object.keys(schemaData.properties).length !== 0
  })));
}