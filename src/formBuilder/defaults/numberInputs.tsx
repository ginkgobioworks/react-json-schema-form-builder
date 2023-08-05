import React, { useState } from 'react';
import { Input } from 'reactstrap';
import FBCheckbox from '../checkbox/FBCheckbox';
import Tooltip from '../Tooltip';
import { getRandomId } from '../utils';
import type { FormInput, CardComponentType } from '../types';

// specify the inputs required for a number type object
const CardNumberParameterInputs: CardComponentType = ({
  parameters,
  onChange,
}) => {
  const [elementId] = useState(getRandomId());
  return (
    <div>
      <h4>
        Multiple of{' '}
        <Tooltip
          id={`${elementId}_multiple`}
          type='help'
          text='Require number to be a multiple of this number'
        />
      </h4>
      <Input
        value={parameters.multipleOf ? parameters.multipleOf : ''}
        placeholder='ex: 2'
        key='multipleOf'
        type='number'
        onChange={(ev) => {
          let newVal: null | number = parseFloat(ev.target.value);
          if (Number.isNaN(newVal)) newVal = null;
          onChange({
            ...parameters,
            multipleOf: newVal,
          });
        }}
        className='card-modal-number'
      />
      <h4>Minimum</h4>
      <Input
        value={parameters.minimum || parameters.exclusiveMinimum || ''}
        placeholder='ex: 3'
        key='minimum'
        type='number'
        onChange={(ev) => {
          let newVal: null | number = parseFloat(ev.target.value);
          if (Number.isNaN(newVal)) newVal = null;
          // change either min or exclusiveMin depending on which one is active
          if (parameters.exclusiveMinimum) {
            onChange({
              ...parameters,
              exclusiveMinimum: newVal,
              minimum: null,
            });
          } else {
            onChange({
              ...parameters,
              minimum: newVal,
              exclusiveMinimum: null,
            });
          }
        }}
        className='card-modal-number'
      />
      <div className='card-modal-boolean'>
        <FBCheckbox
          key='exclusiveMinimum'
          onChangeValue={() => {
            const newMin = parameters.minimum || parameters.exclusiveMinimum;
            if (parameters.exclusiveMinimum) {
              onChange({
                ...parameters,
                exclusiveMinimum: null,
                minimum: newMin,
              });
            } else {
              onChange({
                ...parameters,
                exclusiveMinimum: newMin,
                minimum: null,
              });
            }
          }}
          isChecked={!!parameters.exclusiveMinimum}
          disabled={!parameters.minimum && !parameters.exclusiveMinimum}
          label='Exclusive Minimum'
        />
      </div>
      <h4>Maximum</h4>
      <Input
        value={parameters.maximum || parameters.exclusiveMaximum || ''}
        placeholder='ex: 8'
        key='maximum'
        type='number'
        onChange={(ev) => {
          let newVal: null | number = parseFloat(ev.target.value);
          if (Number.isNaN(newVal)) newVal = null;
          // change either max or exclusiveMax depending on which one is active
          if (parameters.exclusiveMinimum) {
            onChange({
              ...parameters,
              exclusiveMaximum: newVal,
              maximum: null,
            });
          } else {
            onChange({
              ...parameters,
              maximum: newVal,
              exclusiveMaximum: null,
            });
          }
        }}
        className='card-modal-number'
      />
      <div className='card-modal-boolean'>
        <FBCheckbox
          key='exclusiveMaximum'
          onChangeValue={() => {
            const newMax = parameters.maximum || parameters.exclusiveMaximum;
            if (parameters.exclusiveMaximum) {
              onChange({
                ...parameters,
                exclusiveMaximum: null,
                maximum: newMax,
              });
            } else {
              onChange({
                ...parameters,
                exclusiveMaximum: newMax,
                maximum: null,
              });
            }
          }}
          isChecked={!!parameters.exclusiveMaximum}
          disabled={!parameters.maximum && !parameters.exclusiveMaximum}
          label='Exclusive Maximum'
        />
      </div>
    </div>
  );
};

const NumberField: CardComponentType = ({ parameters, onChange }) => {
  return (
    <React.Fragment>
      <h5>Default number</h5>
      <Input
        value={
          parameters.default as string | number | readonly string[] | undefined
        }
        placeholder='Default'
        type='number'
        onChange={(ev) =>
          onChange({
            ...parameters,
            default: parseFloat(ev.target.value),
          })
        }
        className='card-number'
      />
    </React.Fragment>
  );
};

const numberInputs: { [key: string]: FormInput } = {
  integer: {
    displayName: 'Integer',
    matchIf: [
      {
        types: ['integer'],
      },
      {
        types: ['integer'],
        widget: 'number',
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: 'integer',
    cardBody: NumberField,
    modalBody: CardNumberParameterInputs,
  },
  number: {
    displayName: 'Number',
    matchIf: [
      {
        types: ['number'],
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: 'number',
    cardBody: NumberField,
    modalBody: CardNumberParameterInputs,
  },
};

export default numberInputs;
