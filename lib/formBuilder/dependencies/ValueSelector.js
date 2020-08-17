import * as React from "react";
import { Input } from "reactstrap";
import CardEnumOptions from "../CardEnumOptions";
import CardSelector from "./CardSelector";
import FBCheckbox from "../checkbox/FBCheckbox";
import { parse } from "../utils"; // handle value options for different card types

export default function ValueSelector({
  possibility,
  onChange,
  parentEnums,
  parentType,
  parentName,
  parentSchema,
  path
}) {
  if (possibility.value) {
    // enum type
    if (parentEnums) {
      const enumType = typeof parentEnums[0] === "number" ? "number" : "string";
      if (enumType === "string") return /*#__PURE__*/React.createElement(CardSelector, {
        possibleChoices: parentEnums.map(val => `${val}`),
        chosenChoices: possibility.value.enum,
        onChange: chosenChoices => onChange({ ...possibility,
          value: {
            enum: chosenChoices
          }
        }),
        placeholder: "Allowed value",
        path: path
      });
      if (enumType === "number") return /*#__PURE__*/React.createElement(CardSelector, {
        possibleChoices: parentEnums.map(val => `${val}`),
        chosenChoices: possibility.value.enum,
        onChange: chosenChoices => onChange({ ...possibility,
          value: {
            enum: chosenChoices.map(val => Number.parseFloat(val))
          }
        }),
        placeholder: "Allowed value",
        path: path
      });
    } // check box type


    if (parentType === "boolean") {
      return /*#__PURE__*/React.createElement(FBCheckbox, {
        onChangeValue: () => {
          if (possibility.value.enum && possibility.value.enum[0]) {
            onChange({ ...possibility,
              value: {
                enum: [false]
              }
            });
          } else {
            onChange({ ...possibility,
              value: {
                enum: [true]
              }
            });
          }
        },
        isChecked: possibility.value.enum && possibility.value.enum[0],
        label: parentName
      });
    } // object type


    if (parentType === "object") {
      const enumArr = possibility.value.enum;
      return /*#__PURE__*/React.createElement("div", null, enumArr.map((combination, index) => /*#__PURE__*/React.createElement("li", {
        key: `${path}_possibleValue${index}`
      }, Object.keys(combination).map(key => {
        const val = combination[key];
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", null, key, ":"), {
          string: /*#__PURE__*/React.createElement(Input, {
            value: val || "",
            placeholder: "String value",
            type: "string",
            onChange: ev => {
              const newVal = ev.target.value;
              const oldCombo = possibility.value.enum[index];
              onChange({ ...possibility,
                value: {
                  enum: [...enumArr.slice(0, index), { ...oldCombo,
                    [key]: newVal
                  }, ...enumArr.slice(index + 1)]
                }
              });
            },
            className: "card-modal-text"
          }),
          number: /*#__PURE__*/React.createElement(Input, {
            value: val || "",
            placeholder: "Number value",
            type: "number",
            onChange: ev => {
              const newVal = Number.parseFloat(ev.target.value);
              const oldCombo = possibility.value.enum[index];
              onChange({ ...possibility,
                value: {
                  enum: [...enumArr.slice(0, index), { ...oldCombo,
                    [key]: newVal
                  }, ...enumArr.slice(index + 1)]
                }
              });
            },
            className: "card-modal-number"
          }),
          array: /*#__PURE__*/React.createElement(Input, {
            value: JSON.stringify(val) || "",
            placeholder: "Array in JSON",
            type: "string",
            onChange: ev => {
              let newVal = val;

              try {
                newVal = JSON.parse(ev.target.value);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error("invalid JSON array input");
              }

              const oldCombo = possibility.value.enum[index];
              onChange({ ...possibility,
                value: {
                  enum: [...enumArr.slice(0, index), { ...oldCombo,
                    [key]: newVal
                  }, ...enumArr.slice(index + 1)]
                }
              });
            },
            className: "card-modal-text"
          }),
          object: /*#__PURE__*/React.createElement(Input, {
            value: JSON.stringify(val) || "",
            placeholder: "Object in JSON",
            type: "string",
            onChange: ev => {
              let newVal = val;

              try {
                newVal = JSON.parse(ev.target.value);
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error("invalid JSON object input");
              }

              const oldCombo = possibility.value.enum[index];
              onChange({ ...possibility,
                value: {
                  enum: [...enumArr.slice(0, index), { ...oldCombo,
                    [key]: newVal
                  }, ...enumArr.slice(index + 1)]
                }
              });
            },
            className: "card-modal-text"
          })
        }[typeof val]);
      }), /*#__PURE__*/React.createElement("i", {
        className: "fa fa-times",
        onClick: () => onChange({ ...possibility,
          value: {
            enum: [...enumArr.slice(0, index), ...enumArr.slice(index + 1)]
          }
        })
      }))), /*#__PURE__*/React.createElement("i", {
        className: "fa fa-plus",
        onClick: () => {
          const newCase = {};
          const propArr = parentSchema ? parse(parentSchema, "yaml").properties : {};
          Object.keys(propArr).forEach(key => {
            if (propArr[key].type === "number" || propArr[key].type === "integer") {
              newCase[key] = 0;
            } else if (propArr[key].type === "array" || propArr[key].enum) {
              newCase[key] = [];
            } else if (propArr[key].type === "object" || propArr[key].properties) {
              newCase[key] = {};
            } else {
              newCase[key] = "";
            }
          });
          onChange({ ...possibility,
            value: {
              enum: [...enumArr, newCase]
            }
          });
        }
      }));
    }

    return /*#__PURE__*/React.createElement(CardEnumOptions, {
      initialValues: possibility.value.enum,
      onChange: newEnum => onChange({ ...possibility,
        value: {
          enum: newEnum
        }
      }),
      type: parentType || "string",
      showNames: false
    });
  } else {
    return /*#__PURE__*/React.createElement("h5", null, " Appear if defined ");
  }
}