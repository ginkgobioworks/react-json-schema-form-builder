import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import type { CardComponentType } from './types';
import Tooltip from './Tooltip';

export const PlaceholderInput: CardComponentType = ({
  parameters,
  onChange,
}) => {
  return (
    <>
      <Typography variant='subtitle2' fontWeight='bold'>
        Placeholder{' '}
        <Link
          href='https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-placeholder'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Tooltip
            type='help'
            text='Hint to the user as to what kind of information is expected in the field'
          />
        </Link>
      </Typography>
      <TextField
        value={parameters['ui:placeholder'] ? parameters['ui:placeholder'] : ''}
        placeholder='Placeholder'
        type='text'
        onChange={(ev) => {
          onChange({
            ...parameters,
            'ui:placeholder': ev.target.value,
          });
        }}
        size='small'
        fullWidth
      />
    </>
  );
};
