// @flow

import type { FormInput, Parameters } from '../types';
import Select from 'react-select';
import React, { useState } from 'react';
import type { Node } from 'react';
import { PlaceholderInput } from '../inputs/PlaceholderInput';

export function CardReferenceParameterInputs({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (Parameters) => void,
}): Node {
  return (
    <div>
      <PlaceholderInput parameters={parameters} onChange={onChange} />
    </div>
  );
}

function RefChoice({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
  return (
    <div className='card-select'>
      <Select
        value={{
          value: parameters.$ref,
          label: parameters.$ref,
        }}
        placeholder='Reference'
        options={Object.keys(parameters.definitionData || {}).map((key) => ({
          value: `#/definitions/${key}`,
          label: `#/definitions/${key}`,
        }))}
        onChange={(val: any) => {
          onChange({ ...parameters, $ref: val.value });
        }}
        className='card-select'
      />
    </div>
  );
}

const referenceInputs: { [string]: FormInput } = {
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
