import React, { FC, memo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface FBCheckboxProps {
  onChangeValue: () => void;
  isChecked: boolean;
  label?: string;
  value?: string;
  disabled?: boolean;
  dataTest?: string;
}

const FBCheckbox: FC<FBCheckboxProps> = ({
  onChangeValue,
  value = '',
  isChecked = false,
  label = '',
  disabled = false,
  dataTest = '',
}) => {
  return (
    <FormControlLabel
      data-testid='checkbox'
      control={
        <Checkbox
          data-testid={dataTest || undefined}
          onChange={() => {
            if (!disabled) {
              onChangeValue();
            }
          }}
          value={value}
          disabled={disabled}
          checked={isChecked}
          size='small'
        />
      }
      label={label}
      sx={{
        m: 0,
        '& .MuiFormControlLabel-label': {
          fontSize: '0.875rem',
        },
      }}
    />
  );
};

export default memo(FBCheckbox);
