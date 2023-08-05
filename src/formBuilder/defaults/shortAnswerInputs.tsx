import React, { useState } from 'react';
import Select from 'react-select';
import { Input } from 'reactstrap';
import FBCheckbox from '../checkbox/FBCheckbox';
import Tooltip from '../Tooltip';
import { getRandomId } from '../utils';
import type { CardComponentType, FormInput, DataType } from '../types';
import { PlaceholderInput } from '../inputs/PlaceholderInput';

const formatDictionary = {
  '': 'None',
  email: 'Email',
  hostname: 'Hostname',
  uri: 'URI',
  regex: 'Regular Expression',
};

type FormatDictionaryKey = '' | 'email' | 'hostname' | 'uri' | 'regex';

const formatTypeDictionary = {
  email: 'email',
  url: 'uri',
};

type FormatTypeDictionaryKey = 'email' | 'url';

const autoDictionary = {
  '': 'None',
  email: 'Email',
  username: 'User Name',
  password: 'Password',
  'street-address': 'Street Address',
  country: 'Country',
};

type AutoDictionaryKey =
  | ''
  | 'email'
  | 'username'
  | 'password'
  | 'street-address'
  | 'country';

// specify the inputs required for a string type object
const CardShortAnswerParameterInputs: CardComponentType = ({
  parameters,
  onChange,
}) => {
  const [elementId] = useState(getRandomId());
  return (
    <div>
      <h4>Minimum Length</h4>
      <Input
        value={parameters.minLength ? parameters.minLength : ''}
        placeholder='Minimum Length'
        key='minLength'
        type='number'
        onChange={(ev) => {
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
        onChange={(ev) => {
          onChange({
            ...parameters,
            maxLength: parseInt(ev.target.value, 10),
          });
        }}
        className='card-modal-number'
      />
      <h4>
        Regular Expression Pattern{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions'
          target='_blank'
          rel='noopener noreferrer'
        >
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
        onChange={(ev) => {
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
          value: Object.keys(formatDictionary).includes(parameters.format!)
            ? formatDictionary[parameters.format as FormatDictionaryKey]
            : '',
          label: Object.keys(formatDictionary).includes(parameters.format!)
            ? formatDictionary[parameters.format as FormatDictionaryKey]
            : 'None',
        }}
        placeholder='Format'
        key='format'
        options={Object.keys(formatDictionary).map((key: string) => ({
          value: key,
          label: formatDictionary[key as FormatDictionaryKey],
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
            id={`${elementId}_autocomplete`}
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
                  ? (parameters['ui:autocomplete'] as AutoDictionaryKey)
                  : ''
              ]
            : '',
          label: parameters['ui:autocomplete']
            ? autoDictionary[
                typeof parameters['ui:autocomplete'] === 'string'
                  ? (parameters['ui:autocomplete'] as AutoDictionaryKey)
                  : ''
              ]
            : 'None',
        }}
        placeholder='Auto Complete'
        key='ui:autocomplete'
        options={Object.keys(autoDictionary).map((key) => ({
          value: key,
          label: autoDictionary[key as AutoDictionaryKey],
        }))}
        onChange={(val: any) => {
          onChange({
            ...parameters,
            'ui:autocomplete': val.value,
          });
        }}
        className='card-modal-select'
      />
      <PlaceholderInput parameters={parameters} onChange={onChange} />
      <h4>
        Column Size{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Tooltip
            id={`${elementId}_column_size`}
            type='help'
            text='Set the column size of the input'
          />
        </a>
      </h4>
      <Input
        value={parameters['ui:column'] ? parameters['ui:column'] : ''}
        placeholder='Column size'
        key='ui:column'
        type='number'
        onChange={(ev) => {
          onChange({
            ...parameters,
            'ui:column': ev.target.value,
          });
        }}
        className='card-modal-text'
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
};

const ShortAnswerField: CardComponentType = ({ parameters, onChange }) => {
  return (
    <React.Fragment>
      <h5>Default value</h5>
      <Input
        value={
          parameters.default as string | number | readonly string[] | undefined
        }
        placeholder='Default'
        type={
          (formatTypeDictionary[
            parameters.format as FormatTypeDictionaryKey
          ] as 'email' | 'url') || 'text'
        }
        onChange={(ev) => onChange({ ...parameters, default: ev.target.value })}
        className='card-text'
      />
    </React.Fragment>
  );
};

const Password: CardComponentType = ({ parameters, onChange }) => {
  return (
    <React.Fragment>
      <h5>Default password</h5>
      <Input
        value={
          parameters.default as string | number | readonly string[] | undefined
        }
        placeholder='Default'
        type='password'
        onChange={(ev) => onChange({ ...parameters, default: ev.target.value })}
        className='card-text'
      />
    </React.Fragment>
  );
};

const shortAnswerInput: { [key: string]: FormInput } = {
  shortAnswer: {
    displayName: 'Short Answer',
    matchIf: [
      {
        types: ['string'],
      },
      ...['email', 'hostname', 'uri', 'regex'].map((format) => ({
        types: ['string'] as DataType[],
        format,
      })),
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
