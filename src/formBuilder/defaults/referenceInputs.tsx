import React from 'react';
import type { FormInput, CardComponentType } from '../types';
import Select from 'react-select';
import { PlaceholderInput } from '../inputs/PlaceholderInput';

export const CardReferenceParameterInputs: CardComponentType = ({
  parameters,
  onChange,
}) => {
  return (
    <div>
      <PlaceholderInput parameters={parameters} onChange={onChange} />
    </div>
  );
};

const RefChoice: CardComponentType = ({ parameters, onChange }) => {
  const pathArr = (parameters.$ref || '').split('/');
  const currentValueLabel =
    pathArr.length === 3 &&
    pathArr[0] === '#' &&
    pathArr[1] === 'definitions' &&
    (parameters.definitionData || {})[pathArr[2]]
      ? parameters.definitionData![pathArr[2]].title || parameters.$ref
      : parameters.$ref;

  return (
    <div className='card-select'>
      <Select
        value={{
          value: parameters.$ref,
          label: currentValueLabel,
        }}
        placeholder='Reference'
        options={Object.keys(parameters.definitionData || {}).map((key) => ({
          value: `#/definitions/${key}`,
          label:
            parameters.definitionData![key].title || `#/definitions/${key}`,
        }))}
        onChange={(val: any) => {
          onChange({ ...parameters, $ref: val.value });
        }}
        className='card-select'
      />
    </div>
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
