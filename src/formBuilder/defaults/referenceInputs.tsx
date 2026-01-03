import React from 'react';
import type { FormInput, CardComponent } from '../types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { PlaceholderInput } from '../PlaceholderInput';

export const CardReferenceParameterInputs: CardComponent = ({
  parameters,
  onChange,
}) => {
  return <PlaceholderInput parameters={parameters} onChange={onChange} />;
};

const RefChoice: CardComponent = ({ parameters, onChange }) => {
  const pathArr = (parameters.$ref || '').split('/');
  const defData = (parameters.definitionData || {}) as Record<
    string,
    { title?: string }
  >;
  const currentValueLabel =
    pathArr.length === 3 &&
    pathArr[0] === '#' &&
    pathArr[1] === 'definitions' &&
    defData[pathArr[2]]
      ? defData[pathArr[2]].title || parameters.$ref
      : parameters.$ref;

  const options = Object.keys(defData).map((key) => ({
    value: `#/definitions/${key}`,
    label: defData[key].title || `#/definitions/${key}`,
  }));

  return (
    <Autocomplete
      value={{ value: parameters.$ref || '', label: currentValueLabel || '' }}
      options={options}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      onChange={(_, val) => {
        if (val) onChange({ ...parameters, $ref: val.value });
      }}
      size='small'
      disableClearable
      renderInput={(params) => (
        <TextField {...params} placeholder='Reference' />
      )}
    />
  );
};

const referenceInputs: { [key: string]: FormInput } = {
  ref: {
    displayName: 'Reference',
    matchIf: [
      {
        types: ['null'],
        $ref: true,
      },
    ],
    defaultDataSchema: {
      $ref: '',
      title: '',
      description: '',
    },
    defaultUiSchema: {},
    type: 'string',
    cardBody: RefChoice,
    modalBody: CardReferenceParameterInputs,
  },
};

export default referenceInputs;
