// @flow

import React, { useState } from 'react';
import { Input } from 'reactstrap';
import {
  excludeKeys,
  generateElementComponentsFromSchemas,
  generateCategoryHash,
} from '../utils';
import Card from '../Card';
import Section from '../Section';
import FBCheckbox from '../checkbox/FBCheckbox';
import shortAnswerInputs from './shortAnswerInputs';
import longAnswerInputs from './longAnswerInputs';
import numberInputs from './numberInputs';
import defaultInputs from './defaultInputs';
import { getRandomId } from '../utils';
import type { CardBody, Parameters, Mods, FormInput } from '../types';

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
      <Input
        value={parameters.minItems || ''}
        placeholder='ex: 2'
        key='minimum'
        type='number'
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
          onChange({
            ...parameters,
            minItems: parseInt(ev.target.value, 10),
          });
        }}
        className='card-modal-number'
      />
      <h4>Maximum Items</h4>
      <Input
        value={parameters.maxItems || ''}
        placeholder='ex: 2'
        key='maximum'
        type='number'
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
          onChange({
            ...parameters,
            maxItems: parseInt(ev.target.value, 10),
          });
        }}
        className='card-modal-number'
      />
    </div>
  );
}

function getInnerCardComponent({
  defaultFormInputs,
}: {
  defaultFormInputs: { [string]: FormInput },
}): CardBody {
  return function InnerCard({
    parameters,
    onChange,
    mods,
  }: {
    parameters: Parameters,
    onChange: (newParams: Parameters) => void,
    mods?: Mods,
  }) {
    const [elementId] = useState(getRandomId);
    const newDataProps = {};
    const newUiProps = {};
    const allFormInputs = excludeKeys(
      Object.assign(
        {},
        defaultFormInputs,
        (mods && mods.customFormInputs) || {},
      ),
      mods && mods.deactivatedFormInputs,
    );

    // parse components into data and ui relevant pieces
    Object.keys(parameters).forEach((propName) => {
      if (propName.startsWith('ui:*')) {
        newUiProps[propName.substring(4)] = parameters[propName];
      } else if (propName.startsWith('ui:')) {
        newUiProps[propName] = parameters[propName];
      } else if (!['name', 'required'].includes(propName)) {
        newDataProps[propName] = parameters[propName];
      }
    });

    const definitionData = parameters.definitionData
      ? parameters.definitionData
      : {};
    const definitionUi = parameters.definitionUi ? parameters.definitionUi : {};
    const [cardOpen, setCardOpen] = React.useState(false);
    if (parameters.type !== 'array') {
      return <h4>Not an array </h4>;
    }
    return (
      <div className='card-array'>
        <FBCheckbox
          onChangeValue={() => {
            if (newDataProps.items.type === 'object') {
              onChange({
                ...parameters,
                items: {
                  ...newDataProps.items,
                  type: 'string',
                },
              });
            } else {
              onChange({
                ...parameters,
                items: {
                  ...newDataProps.items,
                  type: 'object',
                },
              });
            }
          }}
          isChecked={newDataProps.items.type === 'object'}
          label='Section'
          id={`${elementId}_issection`}
        />
        {generateElementComponentsFromSchemas({
          schemaData: { properties: { item: newDataProps.items } },
          uiSchemaData: { item: newUiProps.items },
          onChange: (schema, uischema) => {
            onChange({
              ...parameters,
              items: schema.properties.item,
              'ui:*items': uischema.item || {},
            });
          },
          path: elementId,
          definitionData,
          definitionUi,
          hideKey: true,
          cardOpenArray: [cardOpen],
          setCardOpenArray: (newArr) => setCardOpen(newArr[0]),
          allFormInputs,
          mods,
          categoryHash: generateCategoryHash(allFormInputs),
          Card: (props) => <Card {...props} showObjectNameInput={false} />,
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
  displayName: 'Array',
  matchIf: [
    {
      types: ['array'],
    },
  ],
  defaultDataSchema: {
    items: { type: 'string' },
  },
  defaultUiSchema: {},
  type: 'array',
  cardBody: getInnerCardComponent({ defaultFormInputs }),
  modalBody: CardArrayParameterInputs,
};

const ArrayInputs: { [string]: FormInput } = {
  array: {
    displayName: 'Array',
    matchIf: [
      {
        types: ['array'],
      },
    ],
    defaultDataSchema: {
      items: { type: 'string' },
    },
    defaultUiSchema: {},
    type: 'array',
    cardBody: getInnerCardComponent({ defaultFormInputs }),
    modalBody: CardArrayParameterInputs,
  },
};

export default ArrayInputs;
