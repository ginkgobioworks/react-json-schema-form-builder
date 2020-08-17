import * as React from "react";
import { Input } from "reactstrap";
import Select from "react-select";
import FBCheckbox from "../checkbox/FBCheckbox";
import CardEnumOptions from "../CardEnumOptions";
// specify the inputs required for a string type object
export function CardDefaultParameterInputs() {
  return /*#__PURE__*/React.createElement("div", null);
}

function TimeField({
  parameters,
  onChange
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", null, "Default time"), /*#__PURE__*/React.createElement(Input, {
    value: parameters.default || "",
    placeholder: "Default",
    type: "datetime-local",
    onChange: ev => onChange({ ...parameters,
      default: ev.target.value
    }),
    className: "card-text"
  }));
}

function Checkbox({
  parameters,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card-boolean"
  }, /*#__PURE__*/React.createElement(FBCheckbox, {
    onChangeValue: () => {
      onChange({ ...parameters,
        default: parameters.default ? parameters.default !== true : true
      });
    },
    isChecked: parameters.default ? parameters.default === true : false,
    label: "Default"
  }));
}

function MultipleChoice({
  parameters,
  onChange
}) {
  const enumArray = Array.isArray(parameters.enum) ? parameters.enum : []; // eslint-disable-next-line no-restricted-globals

  const containsUnparsableString = enumArray.some(val => isNaN(val));
  const containsString = containsUnparsableString || enumArray.some(val => typeof val === "string");
  const [isNumber, setIsNumber] = React.useState(!!enumArray.length && !containsString);
  return /*#__PURE__*/React.createElement("div", {
    className: "card-enum"
  }, /*#__PURE__*/React.createElement("h3", null, "Possible Values"), /*#__PURE__*/React.createElement(FBCheckbox, {
    onChangeValue: () => {
      if (Array.isArray(parameters.enumNames)) {
        // remove the enumNames
        onChange({ ...parameters,
          enumNames: null
        });
      } else {
        // create enumNames as a copy of enum values
        onChange({ ...parameters,
          enumNames: enumArray.map(val => `${val}`)
        });
      }
    },
    isChecked: Array.isArray(parameters.enumNames),
    label: "Display label is different from value"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: containsUnparsableString ? "none" : "initial"
    }
  }, /*#__PURE__*/React.createElement(FBCheckbox, {
    onChangeValue: () => {
      if (containsString) {
        // attempt converting enum values into numbers
        try {
          const newEnum = enumArray.map(val => {
            let newNum = 0;
            if (val) newNum = parseFloat(val);
            if (Number.isNaN(newNum)) throw new Error(`Could not convert ${val}`);
            return newNum;
          });
          setIsNumber(true);
          onChange({ ...parameters,
            enum: newEnum
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      } else {
        // convert enum values back into strings
        const newEnum = enumArray.map(val => `${val}`);
        setIsNumber(false);
        onChange({ ...parameters,
          enum: newEnum
        });
      }
    },
    isChecked: isNumber,
    disabled: containsUnparsableString,
    label: "Force number",
    id: `${typeof parameters.path === "string" ? parameters.path : ""}_forceNumber`
  })), /*#__PURE__*/React.createElement(CardEnumOptions, {
    initialValues: enumArray,
    names: Array.isArray(parameters.enumNames) ? parameters.enumNames.map(val => `${val}`) : undefined,
    showNames: Array.isArray(parameters.enumNames),
    onChange: (newEnum, newEnumNames) => onChange({ ...parameters,
      enum: newEnum,
      enumNames: newEnumNames
    }),
    type: isNumber ? "number" : "string"
  }));
}

function RefChoice({
  parameters,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card-select"
  }, /*#__PURE__*/React.createElement(Select, {
    value: {
      value: parameters.$ref,
      label: parameters.$ref
    },
    placeholder: "Reference",
    options: Object.keys(parameters.definitionData || {}).map(key => ({
      value: `#/definitions/${key}`,
      label: `#/definitions/${key}`
    })),
    onChange: val => {
      onChange({ ...parameters,
        $ref: val.value
      });
    },
    className: "card-select"
  }));
}

const DefaultInputs = {
  time: {
    displayName: "Time",
    matchIf: [{
      types: ["string"],
      format: "date-time"
    }],
    defaultDataSchema: {
      format: "date-time"
    },
    defaultUiSchema: {},
    type: "string",
    cardBody: TimeField,
    modalBody: CardDefaultParameterInputs
  },
  checkbox: {
    displayName: "Checkbox",
    matchIf: [{
      types: ["boolean"]
    }],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: "boolean",
    cardBody: Checkbox,
    modalBody: CardDefaultParameterInputs
  },
  ref: {
    displayName: "Reference",
    matchIf: [{
      types: [null],
      $ref: true
    }],
    defaultDataSchema: {
      $ref: ""
    },
    defaultUiSchema: {},
    type: null,
    cardBody: RefChoice,
    modalBody: CardDefaultParameterInputs
  },
  radio: {
    displayName: "Radio",
    matchIf: [{
      types: ["string", "number", "integer", "array", "boolean", null],
      widget: "radio",
      enum: true
    }],
    defaultDataSchema: {
      enum: []
    },
    defaultUiSchema: {
      "ui:widget": "radio"
    },
    type: null,
    cardBody: MultipleChoice,
    modalBody: CardDefaultParameterInputs
  },
  dropdown: {
    displayName: "Dropdown",
    matchIf: [{
      types: ["string", "number", "integer", "array", "boolean", null],
      enum: true
    }],
    defaultDataSchema: {
      enum: []
    },
    defaultUiSchema: {},
    type: null,
    cardBody: MultipleChoice,
    modalBody: CardDefaultParameterInputs
  }
};
export default DefaultInputs;