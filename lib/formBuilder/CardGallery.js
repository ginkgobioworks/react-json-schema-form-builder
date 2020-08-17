import React from "react";
import { generateElementComponentsFromSchemas, countElementsFromSchema, addCardObj, addSectionObj } from "./utils";
import Add from "./Add";
export default function CardGallery({
  definitionSchema,
  definitionUiSchema,
  onChange,
  mods,
  categoryHash
}) {
  const elementNum = countElementsFromSchema({
    properties: definitionSchema
  });
  const defaultCollapseStates = [...Array(elementNum)].map(() => false);
  const [cardOpenArray, setCardOpenArray] = React.useState(defaultCollapseStates);
  return /*#__PURE__*/React.createElement("div", {
    className: "form-gallery"
  }, generateElementComponentsFromSchemas({
    schemaData: {
      properties: definitionSchema
    },
    uiSchemaData: definitionUiSchema,
    onChange: (newDefinitions, newDefinitionUis) => {
      const oldUi = newDefinitionUis;
      const newUi = {};
      Object.keys(oldUi).forEach(definedUi => {
        if (!["definitions", "ui:order"].includes(definedUi)) newUi[definedUi] = oldUi[definedUi];
      });
      onChange(newDefinitions.properties, newUi);
    },
    path: "definitions",
    definitionData: definitionSchema,
    definitionUi: definitionUiSchema,
    cardOpenArray,
    setCardOpenArray,
    mods,
    categoryHash
  }).map(element => /*#__PURE__*/React.createElement("div", {
    key: typeof element.key === "string" ? element.key : "",
    className: "form-gallery-container"
  }, element)), /*#__PURE__*/React.createElement("div", {
    className: "form-footer"
  }, /*#__PURE__*/React.createElement(Add, {
    name: `form-gallery`,
    addElem: choice => {
      if (choice === "card") {
        addCardObj({
          schema: {
            properties: definitionSchema
          },
          uischema: definitionUiSchema,
          onChange: (newDefinitions, newDefinitionUis) => {
            const oldUi = newDefinitionUis;
            const newUi = {};
            Object.keys(oldUi).forEach(definedUiSchemaKey => {
              if (!["definitions", "ui:order"].includes(definedUiSchemaKey)) newUi[definedUiSchemaKey] = oldUi[definedUiSchemaKey];
            });
            onChange(newDefinitions.properties, newUi);
          },
          definitionData: definitionSchema,
          definitionUi: definitionUiSchema,
          categoryHash
        });
      } else if (choice === "section") {
        addSectionObj({
          schema: {
            properties: definitionSchema
          },
          uischema: definitionUiSchema,
          onChange: (newDefinitions, newDefinitionUis) => {
            const oldUi = newDefinitionUis;
            const newUi = {};
            Object.keys(oldUi).forEach(definedUiSchemaKey => {
              if (!["definitions", "ui:order"].includes(definedUiSchemaKey)) newUi[definedUiSchemaKey] = oldUi[definedUiSchemaKey];
            });
            onChange(newDefinitions.properties, newUi);
          },
          definitionData: definitionSchema,
          definitionUi: definitionUiSchema,
          categoryHash
        });
      }
    },
    hidden: !!definitionSchema && Object.keys(definitionSchema).length !== 0
  })));
}