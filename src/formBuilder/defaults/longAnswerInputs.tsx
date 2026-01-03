import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FBCheckbox from '../FBCheckbox';
import Tooltip from '../Tooltip';
import type { FormInput, CardComponent } from '../types';
import { PlaceholderInput } from '../PlaceholderInput';

// specify the inputs required for a string type object
const CardLongAnswerParameterInputs: CardComponent = ({
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
      <PlaceholderInput parameters={parameters} onChange={onChange} />
      <Box sx={{ mt: 2 }}>
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
    </Box>
  );
};

const LongAnswer: CardComponent = ({ parameters, onChange }) => {
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
        multiline
        rows={3}
        onChange={(ev) => onChange({ ...parameters, default: ev.target.value })}
        size='small'
        fullWidth
      />
    </>
  );
};

const longAnswerInput: { [key: string]: FormInput } = {
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
    modalBody: CardLongAnswerParameterInputs as CardComponent,
  },
};

export default longAnswerInput;
