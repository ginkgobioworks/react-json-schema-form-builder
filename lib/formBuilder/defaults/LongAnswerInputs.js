import React from "react";
import Select from "react-select";
import { Input } from "reactstrap";
import FBCheckbox from "../checkbox/FBCheckbox";
import Tooltip from "../Tooltip";
const formatDictionary = {
  "": "None",
  "date-time": "Date-Time",
  email: "Email",
  hostname: "Hostname",
  time: "Time",
  uri: "URI",
  regex: "Regular Expression"
}; // specify the inputs required for a string type object

function CardLongAnswerParameterInputs({
  parameters,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Minimum Length"), /*#__PURE__*/React.createElement(Input, {
    value: parameters.minLength ? parameters.minLength : "",
    placeholder: "Minimum Length",
    key: "minLength",
    type: "number",
    onChange: ev => {
      onChange({ ...parameters,
        minLength: parseInt(ev.target.value, 10)
      });
    },
    className: "card-modal-number"
  }), /*#__PURE__*/React.createElement("h4", null, "Maximum Length"), /*#__PURE__*/React.createElement(Input, {
    value: parameters.maxLength ? parameters.maxLength : "",
    placeholder: "Maximum Length",
    key: "maxLength",
    type: "number",
    onChange: ev => {
      onChange({ ...parameters,
        maxLength: parseInt(ev.target.value, 10)
      });
    },
    className: "card-modal-number"
  }), /*#__PURE__*/React.createElement("h4", null, "Regular Expression Pattern", /*#__PURE__*/React.createElement("a", {
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    id: `${parameters.path}_regex`,
    type: "help",
    text: "Regular expression pattern that this must satisfy"
  }))), /*#__PURE__*/React.createElement(Input, {
    value: parameters.pattern ? parameters.pattern : "",
    placeholder: "Regular Expression Pattern",
    key: "pattern",
    type: "text",
    onChange: ev => {
      onChange({ ...parameters,
        pattern: ev.target.value
      });
    },
    className: "card-modal-text"
  }), /*#__PURE__*/React.createElement("h4", null, "Format", " ", /*#__PURE__*/React.createElement(Tooltip, {
    id: `${parameters.path}_format`,
    type: "help",
    text: "Require string input to match a certain common format"
  })), /*#__PURE__*/React.createElement(Select, {
    value: {
      value: parameters.format ? formatDictionary[typeof parameters.format === "string" ? parameters.format : ""] : "",
      label: parameters.format ? formatDictionary[typeof parameters.format === "string" ? parameters.format : ""] : "None"
    },
    placeholder: "Format",
    key: "format",
    options: Object.keys(formatDictionary).map(key => ({
      value: key,
      label: formatDictionary[key]
    })),
    onChange: val => {
      onChange({ ...parameters,
        format: val.value
      });
    },
    className: "card-modal-select"
  }), /*#__PURE__*/React.createElement("div", {
    className: "card-modal-boolean"
  }, /*#__PURE__*/React.createElement(FBCheckbox, {
    onChangeValue: () => {
      onChange({ ...parameters,
        "ui:autofocus": parameters["ui:autofocus"] ? parameters["ui:autofocus"] !== true : true
      });
    },
    isChecked: parameters["ui:autofocus"] ? parameters["ui:autofocus"] === true : false,
    label: "Auto Focus"
  })));
}

function LongAnswer({
  parameters,
  onChange
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", null, "Default input"), /*#__PURE__*/React.createElement(Input, {
    value: parameters.default,
    placeholder: "Default",
    type: "textarea",
    onChange: ev => onChange({ ...parameters,
      default: ev.target.value
    }),
    className: "card-textarea"
  }));
}

const LongAnswerInput = {
  longAnswer: {
    displayName: "Long Answer",
    matchIf: [{
      types: ["string"],
      widget: "textarea"
    }],
    defaultDataSchema: {},
    defaultUiSchema: {
      "ui:widget": "textarea"
    },
    type: "string",
    cardBody: LongAnswer,
    modalBody: CardLongAnswerParameterInputs
  }
};
export default LongAnswerInput;