import React, { ReactElement, memo, useMemo } from 'react';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FBRadioButton from './FBRadioButton';

type FBRadioGroupPropsType = {
  options: Array<{ label: string | ReactElement; value: string | number }>;
  onChange: (selection: string) => void;
  defaultValue?: any;
  horizontal?: boolean;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
};

function FBRadioGroup(props: FBRadioGroupPropsType): ReactElement {
  const { options, defaultValue, onChange, horizontal, autoFocus, disabled } =
    props;

  // Use useMemo instead of creating new name on every render
  const name = useMemo(() => Math.random().toString(), []);

  return (
    <FormControl component='fieldset'>
      <RadioGroup name={name} defaultValue={defaultValue} row={horizontal}>
        {options.map((option, index) => (
          <FBRadioButton
            value={option.value}
            label={option.label}
            name={name}
            key={option.value}
            checked={option.value === defaultValue}
            autoFocus={autoFocus && index === 1}
            onChange={onChange}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default memo(FBRadioGroup);
