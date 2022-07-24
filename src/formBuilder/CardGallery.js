// @flow

import React from 'react';
import {
  generateElementComponentsFromSchemas,
  countElementsFromSchema,
  addCardObj,
  addSectionObj,
} from './utils';
import Card from './Card';
import Section from './Section';
import Add from './Add';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import type { Node } from 'react';
import type { Mods } from './types';

export default function CardGallery({
  definitionSchema,
  definitionUiSchema,
  onChange,
  mods,
  categoryHash,
}: {
  definitionSchema: { [string]: any },
  definitionUiSchema: { [string]: any },
  onChange: ({ [string]: any }, { [string]: any }) => void,
  mods?: Mods,
  categoryHash: { [string]: string },
}): Node {
  const elementNum = countElementsFromSchema({
    properties: definitionSchema,
  });
  const defaultCollapseStates = [...Array(elementNum)].map(() => false);
  const [cardOpenArray, setCardOpenArray] = React.useState(
    defaultCollapseStates,
  );
  const allFormInputs = Object.assign(
    {},
    DEFAULT_FORM_INPUTS,
    (mods && mods.customFormInputs) || {},
  );
  const componentArr = generateElementComponentsFromSchemas({
    schemaData: { properties: definitionSchema },
    uiSchemaData: definitionUiSchema,
    onChange: (newDefinitions, newDefinitionUis) => {
      const oldUi = newDefinitionUis;
      const newUi = {};

      Object.keys(oldUi).forEach((definedUi) => {
        if (!['definitions', 'ui:order'].includes(definedUi))
          newUi[definedUi] = oldUi[definedUi];
      });
      onChange(newDefinitions.properties, newUi);
    },
    path: 'definitions',
    definitionData: definitionSchema,
    definitionUi: definitionUiSchema,
    cardOpenArray,
    setCardOpenArray,
    allFormInputs,
    mods,
    categoryHash,
    Card,
    Section,
  }).map((element: any) => (
    <div
      key={typeof element.key === 'string' ? element.key : ''}
      className='form_gallery_container'
    >
      {element}
    </div>
  ));

  return (
    <div className='form_gallery'>
      {componentArr}
      {componentArr.length === 0 && <h5>No components in "definitions"</h5>}
      <div className='form_footer'>
        <Add
          tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
          addElem={(choice: string) => {
            if (choice === 'card') {
              addCardObj({
                schema: { properties: definitionSchema },
                uischema: definitionUiSchema,
                mods: mods,
                onChange: (newDefinitions, newDefinitionUis) => {
                  const oldUi = newDefinitionUis;
                  const newUi = {};

                  Object.keys(oldUi).forEach((definedUiSchemaKey) => {
                    if (
                      !['definitions', 'ui:order'].includes(definedUiSchemaKey)
                    )
                      newUi[definedUiSchemaKey] = oldUi[definedUiSchemaKey];
                  });
                  onChange(newDefinitions.properties, newUi);
                },
                definitionData: definitionSchema,
                definitionUi: definitionUiSchema,
                categoryHash,
              });
            } else if (choice === 'section') {
              addSectionObj({
                schema: { properties: definitionSchema },
                uischema: definitionUiSchema,
                onChange: (newDefinitions, newDefinitionUis) => {
                  const oldUi = newDefinitionUis;
                  const newUi = {};

                  Object.keys(oldUi).forEach((definedUiSchemaKey) => {
                    if (
                      !['definitions', 'ui:order'].includes(definedUiSchemaKey)
                    )
                      newUi[definedUiSchemaKey] = oldUi[definedUiSchemaKey];
                  });
                  onChange(newDefinitions.properties, newUi);
                },
                definitionData: definitionSchema,
                definitionUi: definitionUiSchema,
                categoryHash,
              });
            }
          }}
          hidden={
            !!definitionSchema && Object.keys(definitionSchema).length !== 0
          }
        />
      </div>
    </div>
  );
}
