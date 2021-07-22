// @flow

import type { FormInput, Parameters } from '../types';
import Select from 'react-select';
import React, { useState } from 'react';
import { Input } from 'reactstrap';
import Tooltip from '../Tooltip';
import { getRandomId } from '../utils';

export function CardReferenceParameterInputs({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (Parameters) => void,
}): Node {
  const [elementId] = useState(getRandomId());
  return (
    <div>
      <h4>
        Placeholder{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Tooltip
            id={`${elementId}_placeholder`}
            type='help'
            text='Hint to the user as to what kind of information is expected in the field'
          />
        </a>
      </h4>
      <Input
        value={parameters['ui:placeholder']}
        placeholder='Placeholder'
        key='placeholder'
        type='text'
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
          onChange({
            ...parameters,
            'ui:placeholder': ev.target.value,
          });
        }}
        className='card-modal-text'
      />
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
