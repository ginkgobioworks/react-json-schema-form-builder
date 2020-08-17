import React from "react";
import Select from "react-select";
import { Input } from "reactstrap";
import GeneralParameterInputs from "./GeneralParameterInputs";
import { defaultUiProps, defaultDataProps, categoryToNameMap, categoryType } from "./utils";
import Tooltip from "./Tooltip"; // specify the inputs required for any type of object

export default function CardGeneralParameterInputs({
  parameters,
  onChange,
  mods
}) {
  const [keyState, setKeyState] = React.useState(parameters.name);
  const [titleState, setTitleState] = React.useState(parameters.title);
  const [descriptionState, setDescriptionState] = React.useState(parameters.description);
  const categoryMap = categoryToNameMap(parameters.category, mods);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-entry"
  }, /*#__PURE__*/React.createElement("h5", null, "Object Name", " ", /*#__PURE__*/React.createElement(Tooltip, {
    text: mods && mods.tooltipDescriptions && typeof mods.tooltipDescriptions.cardObjectName === "string" ? mods.tooltipDescriptions.cardObjectName : "The back-end name of the object",
    id: `${keyState}_nameinfo`,
    type: "help"
  })), /*#__PURE__*/React.createElement(Input, {
    value: keyState || "",
    placeholder: "Key",
    type: "text",
    onChange: ev => setKeyState(ev.target.value.replace(/\W/g, "_")),
    onBlur: ev => onChange({ ...parameters,
      name: ev.target.value
    }),
    className: "card-text"
  })), /*#__PURE__*/React.createElement("div", {
    className: `card-entry ${parameters.$ref === undefined ? "" : "disabled-input"}`
  }, /*#__PURE__*/React.createElement("h5", null, "Display Name", " ", /*#__PURE__*/React.createElement(Tooltip, {
    text: mods && mods.tooltipDescriptions && typeof mods.tooltipDescriptions.cardDisplayName === "string" ? mods.tooltipDescriptions.cardDisplayName : "The user-facing name of this object",
    id: `${keyState}-titleinfo`,
    type: "help"
  })), /*#__PURE__*/React.createElement(Input, {
    value: titleState || "",
    placeholder: "Title",
    type: "text",
    onChange: ev => setTitleState(ev.target.value),
    onBlur: ev => {
      onChange({ ...parameters,
        title: ev.target.value
      });
    },
    className: "card-text",
    readOnly: parameters.$ref !== undefined
  })), /*#__PURE__*/React.createElement("div", {
    className: `card-entry ${parameters.$ref ? "disabled-input" : ""}`
  }, /*#__PURE__*/React.createElement("h5", null, "Description", " ", /*#__PURE__*/React.createElement(Tooltip, {
    text: mods && mods.tooltipDescriptions && typeof mods.tooltipDescriptions.cardDescription === "string" ? mods.tooltipDescriptions.cardDescription : "This will appear as help text on the form",
    id: `${keyState}-descriptioninfo`,
    type: "help"
  })), /*#__PURE__*/React.createElement(Input, {
    value: descriptionState || "",
    placeholder: "Description",
    type: "text",
    onChange: ev => setDescriptionState(ev.target.value),
    onBlur: ev => {
      onChange({ ...parameters,
        description: ev.target.value
      });
    },
    className: "card-text",
    readOnly: parameters.$ref !== undefined
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-entry"
  }, /*#__PURE__*/React.createElement("h5", null, "Input Type", " ", /*#__PURE__*/React.createElement(Tooltip, {
    text: mods && mods.tooltipDescriptions && typeof mods.tooltipDescriptions.cardInputType === "string" ? mods.tooltipDescriptions.cardInputType : "The type of form input displayed on the form",
    id: `${keyState}-inputinfo`,
    type: "help"
  })), /*#__PURE__*/React.createElement(Select, {
    value: {
      value: parameters.category,
      label: categoryMap[parameters.category]
    },
    placeholder: "Category",
    options: Object.keys(categoryMap).filter(key => key !== "ref" || parameters.definitionData && Object.keys(parameters.definitionData).length !== 0).map(key => ({
      value: key,
      label: categoryMap[key]
    })),
    onChange: val => {
      // figure out the new 'type'
      const newCategory = val.value;
      const newProps = { ...defaultUiProps(newCategory, mods),
        ...defaultDataProps(newCategory, mods),
        name: parameters.name,
        required: parameters.required
      };

      if (newProps.$ref !== undefined && !newProps.$ref) {
        // assign an initial reference
        const firstDefinition = Object.keys(parameters.definitionData)[0];
        newProps.$ref = `#/definitions/${firstDefinition || "empty"}`;
      }

      onChange({ ...newProps,
        title: newProps.title || parameters.title,
        default: newProps.default || "",
        type: newProps.type || categoryType(newCategory, mods),
        category: newProps.category || newCategory
      });
    },
    className: "card-select"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-category-options"
  }, /*#__PURE__*/React.createElement(GeneralParameterInputs, {
    category: parameters.category,
    parameters: parameters,
    onChange: onChange,
    mods: mods
  })));
}