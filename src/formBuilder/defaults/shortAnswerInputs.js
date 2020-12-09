// @flow

import React from 'react';
import Select from 'react-select';
import { Input } from 'reactstrap';
import FBCheckbox from '../checkbox/FBCheckbox';
import Tooltip from '../Tooltip';
import type { Parameters } from '../types';

const formatDictionary = {
  '': 'None',
  'date-time': 'Date-Time',
  email: 'Email',
  hostname: 'Hostname',
  time: 'Time',
  uri: 'URI',
  regex: 'Regular Expression',
};

const autoDictionary = {
  '': 'None',
  email: 'Email',
  username: 'User Name',
  password: 'Password',
  'street-address': 'Street Address',
  country: 'Country',
};

// specify the inputs required for a string type object
function CardShortAnswerParameterInputs({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
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
        Regular Expression Pattern
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Tooltip
            id={`${parameters.path}_regex`}
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
          id={`${parameters.path}_format`}
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
      <h5>
        Auto Complete Category{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Tooltip
            id={`${parameters.path}_autocomplete`}
            type='help'
            text="Suggest entries based on the user's browser history"
          />
        </a>
      </h5>
      <Select
        value={{
          value: parameters['ui:autocomplete']
            ? autoDictionary[
                typeof parameters['ui:autocomplete'] === 'string'
                  ? parameters['ui:autocomplete']
                  : ''
              ]
            : '',
          label: parameters['ui:autocomplete']
            ? autoDictionary[
                typeof parameters['ui:autocomplete'] === 'string'
                  ? parameters['ui:autocomplete']
                  : ''
              ]
            : 'None',
        }}
        placeholder='Auto Complete'
        key='ui:autocomplete'
        options={Object.keys(autoDictionary).map((key) => ({
          value: key,
          label: autoDictionary[key],
        }))}
        onChange={(val: any) => {
          onChange({
            ...parameters,
            'ui:autocomplete': val.value,
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

function ShortAnswerField({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
  return (
    <React.Fragment>
      <h5>Default value</h5>
      <Input
        value={parameters.default}
        placeholder='Default'
        type='text'
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
          onChange({ ...parameters, default: ev.target.value })
        }
        className='card-text'
      />
    </React.Fragment>
  );
}

function Password({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
  return (
    <React.Fragment>
      <h5>Default password</h5>
      <Input
        value={parameters.default}
        placeholder='Default'
        type='password'
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
          onChange({ ...parameters, default: ev.target.value })
        }
        className='card-text'
      />
    </React.Fragment>
  );
}

const shortAnswerInput = {
  shortAnswer: {
    displayName: 'Short Answer',
    matchIf: [
      {
        types: ['string'],
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: 'string',
    cardBody: ShortAnswerField,
    modalBody: CardShortAnswerParameterInputs,
  },
  password: {
    displayName: 'Password',
    matchIf: [
      {
        types: ['string'],
        widget: 'password',
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {
      'ui:widget': 'password',
    },
    type: 'string',
    cardBody: Password,
    modalBody: CardShortAnswerParameterInputs,
  },
};

export default shortAnswerInput;
