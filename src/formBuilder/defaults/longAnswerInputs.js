// @flow

import React, { useState } from 'react';
import Select from 'react-select';
import { Input } from 'reactstrap';
import FBCheckbox from '../checkbox/FBCheckbox';
import Tooltip from '../Tooltip';
import { getRandomId } from '../utils';
import type { Parameters, FormInput } from '../types';

const formatDictionary = {
  '': 'None',
  'date-time': 'Date-Time',
  email: 'Email',
  hostname: 'Hostname',
  time: 'Time',
  uri: 'URI',
  regex: 'Regular Expression',
};

// specify the inputs required for a string type object
function CardLongAnswerParameterInputs({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
  const [elementId] = useState(getRandomId());
  return (
    <div>
      <h4>Minimum Length</h4>
      <Input
        value={parameters.minLength ? parameters.minLength : ''}
        placeholder='Minimum Length'
        key='minLength'
        type='number'
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
          onChange({
            ...parameters,
            minLength: parseInt(ev.target.value, 10),
          });
        }}
        className='card-modal-number'
      />
      <h4>Maximum Length</h4>
      <Input
        value={parameters.maxLength ? parameters.maxLength : ''}
        placeholder='Maximum Length'
        key='maxLength'
        type='number'
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
          onChange({
            ...parameters,
            maxLength: parseInt(ev.target.value, 10),
          });
        }}
        className='card-modal-number'
      />
      <h4>
        Regular Expression Pattern{' '}
        <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions'>
          <Tooltip
            id={`${elementId}_regex`}
            type='help'
            text='Regular expression pattern that this must satisfy'
          />
        </a>
      </h4>
      <Input
        value={parameters.pattern ? parameters.pattern : ''}
        placeholder='Regular Expression Pattern'
        key='pattern'
        type='text'
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
          onChange({
            ...parameters,
            pattern: ev.target.value,
          });
        }}
        className='card-modal-text'
      />
      <h4>
        Format{' '}
        <Tooltip
          id={`${elementId}_format`}
          type='help'
          text='Require string input to match a certain common format'
        />
      </h4>
      <Select
        value={{
          value: parameters.format
            ? formatDictionary[
                typeof parameters.format === 'string' ? parameters.format : ''
              ]
            : '',
          label: parameters.format
            ? formatDictionary[
                typeof parameters.format === 'string' ? parameters.format : ''
              ]
            : 'None',
        }}
        placeholder='Format'
        key='format'
        options={Object.keys(formatDictionary).map((key) => ({
          value: key,
          label: formatDictionary[key],
        }))}
        onChange={(val: any) => {
          onChange({
            ...parameters,
            format: val.value,
          });
        }}
        className='card-modal-select'
      />
      <div className='card-modal-boolean'>
        <FBCheckbox
          onChangeValue={() => {
            onChange({
              ...parameters,
              'ui:autofocus': parameters['ui:autofocus']
                ? parameters['ui:autofocus'] !== true
                : true,
            });
          }}
          isChecked={
            parameters['ui:autofocus']
              ? parameters['ui:autofocus'] === true
              : false
          }
          label='Auto Focus'
        />
      </div>
    </div>
  );
}

function LongAnswer({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
  return (
    <React.Fragment>
      <h5>Default input</h5>
      <Input
        value={parameters.default}
        placeholder='Default'
        type='textarea'
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
          onChange({ ...parameters, default: ev.target.value })
        }
        className='card-textarea'
      />
    </React.Fragment>
  );
}

const longAnswerInput: { [string]: FormInput } = {
  longAnswer: {
    displayName: 'Long Answer',
    matchIf: [
      {
        types: ['string'],
        widget: 'textarea',
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {
      'ui:widget': 'textarea',
    },
    type: 'string',
    cardBody: LongAnswer,
    modalBody: CardLongAnswerParameterInputs,
  },
};

export default longAnswerInput;
