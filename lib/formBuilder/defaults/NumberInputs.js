import React from "react";
import { Input } from "reactstrap";
import FBCheckbox from "../checkbox/FBCheckbox";
import Tooltip from "../Tooltip";

// specify the inputs required for a number type object
function CardNumberParameterInputs({
  parameters,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Multiple of", " ", /*#__PURE__*/React.createElement(Tooltip, {
    id: `${parameters.path}_multiple`,
    type: "help",
    text: "Require number to be a multiple of this number"
  })), /*#__PURE__*/React.createElement(Input, {
    value: parameters.multipleOf ? parameters.multipleOf : "",
    placeholder: "ex: 2",
    key: "multipleOf",
    type: "number",
    onChange: ev => {
      let newVal = parseFloat(ev.target.value);
      if (Number.isNaN(newVal)) newVal = null;
      onChange({ ...parameters,
        multipleOf: newVal
      });
    },
    className: "card-modal-number"
  }), /*#__PURE__*/React.createElement("h4", null, "Minimum"), /*#__PURE__*/React.createElement(Input, {
    value: parameters.minimum || parameters.exclusiveMinimum || "",
    placeholder: "ex: 3",
    key: "minimum",
    type: "number",
    onChange: ev => {
      let newVal = parseFloat(ev.target.value);
      if (Number.isNaN(newVal)) newVal = null; // change either min or exclusiveMin depending on which one is active

      if (parameters.exclusiveMinimum) {
        onChange({ ...parameters,
          exclusiveMinimum: newVal,
          minimum: null
        });
      } else {
        onChange({ ...parameters,
          minimum: newVal,
          exclusiveMinimum: null
        });
      }
    },
    className: "card-modal-number"
  }), /*#__PURE__*/React.createElement("div", {
    className: "card-modal-boolean"
  }, /*#__PURE__*/React.createElement(FBCheckbox, {
    key: "exclusiveMinimum",
    onChangeValue: () => {
      const newMin = parameters.minimum || parameters.exclusiveMinimum;

      if (parameters.exclusiveMinimum) {
        onChange({ ...parameters,
          exclusiveMinimum: null,
          minimum: newMin
        });
      } else {
        onChange({ ...parameters,
          exclusiveMinimum: newMin,
          minimum: null
        });
      }
    },
    isChecked: !!parameters.exclusiveMinimum,
    disabled: !parameters.minimum && !parameters.exclusiveMinimum,
    label: "Exclusive Minimum"
  })), /*#__PURE__*/React.createElement("h4", null, "Maximum"), /*#__PURE__*/React.createElement(Input, {
    value: parameters.maximum || parameters.exclusiveMaximum || "",
    placeholder: "ex: 8",
    key: "maximum",
    type: "number",
    onChange: ev => {
      let newVal = parseFloat(ev.target.value);
      if (Number.isNaN(newVal)) newVal = null; // change either max or exclusiveMax depending on which one is active

      if (parameters.exclusiveMinimum) {
        onChange({ ...parameters,
          exclusiveMaximum: newVal,
          maximum: null
        });
      } else {
        onChange({ ...parameters,
          maximum: newVal,
          exclusiveMaximum: null
        });
      }
    },
    className: "card-modal-number"
  }), /*#__PURE__*/React.createElement("div", {
    className: "card-modal-boolean"
  }, /*#__PURE__*/React.createElement(FBCheckbox, {
    key: "exclusiveMaximum",
    onChangeValue: () => {
      const newMax = parameters.maximum || parameters.exclusiveMaximum;

      if (parameters.exclusiveMaximum) {
        onChange({ ...parameters,
          exclusiveMaximum: null,
          maximum: newMax
        });
      } else {
        onChange({ ...parameters,
          exclusiveMaximum: newMax,
          maximum: null
        });
      }
    },
    isChecked: !!parameters.exclusiveMaximum,
    disabled: !parameters.maximum && !parameters.exclusiveMaximum,
    label: "Exclusive Maximum"
  })));
}

function NumberField({
  parameters,
  onChange
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", null, "Default number"), /*#__PURE__*/React.createElement(Input, {
    value: parameters.default,
    placeholder: "Default",
    type: "number",
    onChange: ev => onChange({ ...parameters,
      default: parseFloat(ev.target.value)
    }),
    className: "card-number"
  }));
}

const NumberInputs = {
  integer: {
    displayName: "Integer",
    matchIf: [{
      types: ["integer"]
    }, {
      types: ["integer"],
      widget: "number"
    }],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: "integer",
    cardBody: NumberField,
    modalBody: CardNumberParameterInputs
  },
  number: {
    displayName: "Number",
    matchIf: [{
      types: ["number"]
    }],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: "number",
    cardBody: NumberField,
    modalBody: CardNumberParameterInputs
  }
};
export default NumberInputs;