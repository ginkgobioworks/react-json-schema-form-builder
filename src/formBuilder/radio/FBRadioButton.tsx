import React, { ReactElement, memo, useCallback } from 'react';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

type Props = {
  label: ReactElement | string;
  value?: any;
  name?: string;
  checked?: boolean;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  onChange: (selection: string) => void;
};

function FBRadioButton(props: Props): ReactElement {
  const {
    label,
    value,
    checked,
    name,
    onChange,
    required,
    disabled,
    autoFocus,
  } = props;

  const handleChange = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <FormControlLabel
      value={value}
      control={
        <Radio
          name={name}
          checked={checked}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={handleChange}
          size='small'
        />
      }
      label={label}
      sx={{
        '& .MuiFormControlLabel-label': {
          fontSize: '0.875rem',
        },
      }}
    />
  );
}

export default memo(FBRadioButton);
