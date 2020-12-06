// @flow

import React from "react";
import { Input } from "reactstrap";
import {
  generateElementComponentsFromSchemas,
  generateCategoryHash,
} from "../utils";
import Card from "../Card";
import Section from "../Section";
import FBCheckbox from "../checkbox/FBCheckbox";
import shortAnswerInputs from "./shortAnswerInputs";
import longAnswerInputs from "./longAnswerInputs";
import numberInputs from "./numberInputs";
import defaultInputs from "./defaultInputs";
import type { Parameters, Mods, FormInput } from "../types";

// specify the inputs required for a string type object
function CardArrayParameterInputs({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: ({ [string]: any }) => void,
}) {
  return (
    <div>
      <h4>Minimum Items</h4>
      <input
        value={parameters.minItems || ""}
        placeholder="ex: 2"
        key="minimum"
        type="number"
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
          onChange({
            ...parameters,
            minItems: parseInt(ev.target.value, 10),
          });
        }}
        className="card-modal-number"
      />
      <h4>Maximum Items</h4>
      <input
        value={parameters.maxItems || ""}
        placeholder="ex: 2"
        key="maximum"
        type="number"
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
          onChange({
            ...parameters,
            maxItems: parseInt(ev.target.value, 10),
          });
        }}
        className="card-modal-number"
      />
    </div>
  );
}

function InnerCardWrapper({
  defaultFormInputs,
}: {
  defaultFormInputs: { [string]: FormInput },
}) {
  return function InnerCard({
    parameters,
    onChange,
    mods,
  }: {
    parameters: Parameters,
    onChange: (newParams: Parameters) => void,
    mods?: Mods,
  }) {
    const newDataProps = {};
    const newUiProps = {};
    const allFormInputs = {
      ...defaultFormInputs,
      ...(mods && mods.customFormInputs),
    };
    // parse components into data and ui relevant pieces
    Object.keys(parameters).forEach((propName) => {
      if (propName.startsWith("ui:*")) {
        newUiProps[propName.substring(4)] = parameters[propName];
      } else if (propName.startsWith("ui:")) {
        newUiProps[propName] = parameters[propName];
      } else if (!["name", "required"].includes(propName)) {
        newDataProps[propName] = parameters[propName];
      }
    });

    const definitionData = parameters.definitionData
      ? parameters.definitionData
      : {};
    const definitionUi = parameters.definitionUi ? parameters.definitionUi : {};
    const [cardOpen, setCardOpen] = React.useState(false);
    if (parameters.type !== "array") {
      return <h4>Not an array </h4>;
    }
    return (
      <div className="card-array">
        <FBCheckbox
          onChangeValue={() => {
            if (newDataProps.items.type === "object") {
              onChange({
                ...parameters,
                items: {
                  ...newDataProps.items,
                  type: "string",
                },
              });
            } else {
              onChange({
                ...parameters,
                items: {
                  ...newDataProps.items,
                  type: "object",
                },
              });
            }
          }}
          isChecked={newDataProps.items.type === "object"}
          label="Section"
          id={`${
            typeof parameters.path === "string" ? parameters.path : ""
          }_issection`}
        />
        {generateElementComponentsFromSchemas({
          schemaData: { properties: { Item: newDataProps.items } },
          uiSchemaData: { Item: newUiProps.items },
          onChange: (schema, uischema) => {
            onChange({
              ...parameters,
              items: schema.properties.Item,
              "ui:*items": uischema.Item || {},
            });
          },
          path: typeof parameters.path === "string" ? parameters.path : "array",
          definitionData:
            typeof definitionData === "string" ? definitionData : {},
          definitionUi: typeof definitionUi === "string" ? definitionUi : {},
          hideKey: true,
          cardOpenArray: [cardOpen],
          setCardOpenArray: (newArr) => setCardOpen(newArr[0]),
          allFormInputs,
          mods,
          categoryHash: generateCategoryHash(allFormInputs),
          Card,
          Section,
        })}
      </div>
    );
  };
}

const defaultFormInputs = ({
  ...defaultInputs,
  ...shortAnswerInputs,
  ...longAnswerInputs,
  ...numberInputs,
}: { [string]: FormInput });
defaultFormInputs.array = {
  displayName: "Array",
  matchIf: [
    {
      types: ["array"],
    },
  ],
  defaultDataSchema: {
    items: { type: "string" },
  },
  defaultUiSchema: {},
  type: "array",
  cardBody: InnerCardWrapper({ defaultFormInputs }),
  modalBody: CardArrayParameterInputs,
};

const ArrayInputs = {
  array: {
    displayName: "Array",
    matchIf: [
      {
        types: ["array"],
      },
    ],
    defaultDataSchema: {
      items: { type: "string" },
    },
    defaultUiSchema: {},
    type: "array",
    cardBody: InnerCardWrapper({ defaultFormInputs }),
    modalBody: CardArrayParameterInputs,
  },
};

export default ArrayInputs;
