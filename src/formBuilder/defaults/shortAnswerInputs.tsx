import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FBCheckbox from '../FBCheckbox';
import Tooltip from '../Tooltip';
import type { CardComponent, FormInput, DataType } from '../types';
import { PlaceholderInput } from '../PlaceholderInput';

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
const CardShortAnswerParameterInputs: CardComponent = ({
  parameters,
  onChange,
}) => {
  return (
    <Box>
      <Typography variant='subtitle2' fontWeight='bold'>
        Minimum Length
      </Typography>
      <TextField
        value={parameters.minLength ? parameters.minLength : ''}
        placeholder='Minimum Length'
        type='number'
        onChange={(ev) => {
          onChange({
            ...parameters,
            minLength: parseInt(ev.target.value, 10),
          });
        }}
        size='small'
        fullWidth
        sx={{ mb: 2 }}
      />
      <Typography variant='subtitle2' fontWeight='bold'>
        Maximum Length
      </Typography>
      <TextField
        value={parameters.maxLength ? parameters.maxLength : ''}
        placeholder='Maximum Length'
        type='number'
        onChange={(ev) => {
          onChange({
            ...parameters,
            maxLength: parseInt(ev.target.value, 10),
          });
        }}
        size='small'
        fullWidth
        sx={{ mb: 2 }}
      />
      <Typography variant='subtitle2' fontWeight='bold'>
        Regular Expression Pattern{' '}
        <Link
          href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Tooltip
            type='help'
            text='Regular expression pattern that this must satisfy'
          />
        </Link>
      </Typography>
      <TextField
        value={parameters.pattern ? parameters.pattern : ''}
        placeholder='Regular Expression Pattern'
        type='text'
        onChange={(ev) => {
          onChange({
            ...parameters,
            pattern: ev.target.value,
          });
        }}
        size='small'
        fullWidth
        sx={{ mb: 2 }}
      />
      <Typography variant='subtitle2' fontWeight='bold'>
        Format{' '}
        <Tooltip
          type='help'
          text='Require string input to match a certain common format'
        />
      </Typography>
      <Autocomplete
        value={
          Object.keys(formatDictionary)
            .map((key) => ({
              value: key,
              label: formatDictionary[key as FormatDictionaryKey],
            }))
            .find((opt) => opt.value === (parameters.format || '')) || {
            value: '',
            label: 'None',
          }
        }
        options={Object.keys(formatDictionary).map((key: string) => ({
          value: key,
          label: formatDictionary[key as FormatDictionaryKey],
        }))}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(_, val) => {
          if (val) {
            onChange({
              ...parameters,
              format: val.value,
            });
          }
        }}
        size='small'
        disableClearable
        renderInput={(params) => <TextField {...params} placeholder='Format' />}
        sx={{ mb: 2 }}
      />
      <Typography variant='subtitle2' fontWeight='bold'>
        Auto Complete Category{' '}
        <Link
          href='https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Tooltip
            type='help'
            text="Suggest entries based on the user's browser history"
          />
        </Link>
      </Typography>
      <Autocomplete
        value={
          Object.keys(autoDictionary)
            .map((key) => ({
              value: key,
              label: autoDictionary[key as AutoDictionaryKey],
            }))
            .find(
              (opt) =>
                opt.value ===
                (typeof parameters['ui:autocomplete'] === 'string'
                  ? parameters['ui:autocomplete']
                  : ''),
            ) || { value: '', label: 'None' }
        }
        options={Object.keys(autoDictionary).map((key) => ({
          value: key,
          label: autoDictionary[key as AutoDictionaryKey],
        }))}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(_, val) => {
          if (val) {
            onChange({
              ...parameters,
              'ui:autocomplete': val.value,
            });
          }
        }}
        size='small'
        disableClearable
        renderInput={(params) => (
          <TextField {...params} placeholder='Auto Complete' />
        )}
        sx={{ mb: 2 }}
      />
      <PlaceholderInput parameters={parameters} onChange={onChange} />
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
    </Box>
  );
};

const ShortAnswerField: CardComponent = ({ parameters, onChange }) => {
  return (
    <>
      <Typography variant='subtitle2' fontWeight='bold'>
        Default Value
      </Typography>
      <TextField
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
        size='small'
        fullWidth
      />
    </>
  );
};

const Password: CardComponent = ({ parameters, onChange }) => {
  return (
    <>
      <Typography variant='subtitle2' fontWeight='bold'>
        Default password
      </Typography>
      <TextField
        value={
          parameters.default as string | number | readonly string[] | undefined
        }
        placeholder='Default'
        type='password'
        onChange={(ev) => onChange({ ...parameters, default: ev.target.value })}
        size='small'
        fullWidth
      />
    </>
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
