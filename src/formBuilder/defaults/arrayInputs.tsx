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
import type {
  FormInput,
  CardComponentType,
  CardComponentPropsType,
} from '../types';

// specify the inputs required for a string type object
const CardArrayParameterInputs: CardComponentType = ({
  parameters,
  onChange,
}) => {
  return (
    <div>
      <h4>Minimum Items</h4>
      <Input
        value={parameters.minItems || ''}
        placeholder='ex: 2'
        key='minimum'
        type='number'
        onChange={(ev) => {
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
        onChange={(ev) => {
          onChange({
            ...parameters,
            maxItems: parseInt(ev.target.value, 10),
          });
        }}
        className='card-modal-number'
      />
    </div>
  );
};

const InnerCard: CardComponentType = ({ parameters, onChange, mods }) => {
  const [elementId] = useState(getRandomId);
  const newDataProps: { [key: string]: any } = {};
  const newUiProps: { [key: string]: any } = {};
  const allFormInputs = excludeKeys(
    Object.assign({}, defaultFormInputs, (mods && mods.customFormInputs) || {}),
    mods && mods.deactivatedFormInputs,
  );

  // parse components into data and ui relevant pieces
  Object.keys(parameters).forEach((propName: string) => {
    if (propName.startsWith('ui:*')) {
      newUiProps[propName.substring(4)] =
        parameters[propName as keyof CardComponentPropsType];
    } else if (propName.startsWith('ui:')) {
      newUiProps[propName] =
        parameters[propName as keyof CardComponentPropsType];
    } else if (!['name', 'required'].includes(propName)) {
      newDataProps[propName] =
        parameters[propName as keyof CardComponentPropsType];
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

function getInnerCardComponent(): CardComponentType {
  return InnerCard;
}

const defaultFormInputs: { [key: string]: FormInput } = {
  ...defaultInputs,
  ...shortAnswerInputs,
  ...longAnswerInputs,
  ...numberInputs,
};
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
  cardBody: getInnerCardComponent(),
  modalBody: CardArrayParameterInputs,
};

const ArrayInputs: { [key: string]: FormInput } = {
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
    cardBody: getInnerCardComponent(),
    modalBody: CardArrayParameterInputs,
  },
};

export default ArrayInputs;
