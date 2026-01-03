import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FBCheckbox from '../FBCheckbox';
import Tooltip from '../Tooltip';
import type { FormInput, CardComponent } from '../types';

// specify the inputs required for a number type object
const CardNumberParameterInputs: CardComponent = ({ parameters, onChange }) => {
  return (
    <Box>
      <Typography variant='subtitle2' fontWeight='bold'>
        Multiple of{' '}
        <Tooltip
          type='help'
          text='Require number to be a multiple of this number'
        />
      </Typography>
      <TextField
        value={parameters.multipleOf ? parameters.multipleOf : ''}
        placeholder='ex: 2'
        type='number'
        onChange={(ev) => {
          let newVal: null | number = parseFloat(ev.target.value);
          if (Number.isNaN(newVal)) newVal = null;
          onChange({
            ...parameters,
            multipleOf: newVal,
          });
        }}
        size='small'
        fullWidth
        sx={{ mb: 2 }}
      />
      <Typography variant='subtitle2' fontWeight='bold'>
        Minimum
      </Typography>
      <TextField
        value={parameters.minimum || parameters.exclusiveMinimum || ''}
        placeholder='ex: 3'
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
        size='small'
        fullWidth
        sx={{ mb: 1 }}
      />
      <Box sx={{ mb: 2 }}>
        <FBCheckbox
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
      </Box>
      <Typography variant='subtitle2' fontWeight='bold'>
        Maximum
      </Typography>
      <TextField
        value={parameters.maximum || parameters.exclusiveMaximum || ''}
        placeholder='ex: 8'
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
        size='small'
        fullWidth
        sx={{ mb: 1 }}
      />
      <Box>
        <FBCheckbox
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
      </Box>
    </Box>
  );
};

const NumberField: CardComponent = ({ parameters, onChange }) => {
  return (
    <>
      <Typography variant='subtitle2' fontWeight='bold'>
        Default number
      </Typography>
      <TextField
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
        size='small'
        fullWidth
      />
    </>
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
