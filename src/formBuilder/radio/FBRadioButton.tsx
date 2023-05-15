import React, { useState, ReactElement } from 'react';
import classnames from 'classnames';

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

export default function FBRadioButton(props: Props): ReactElement {
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
  const [id] = useState(`radio-${Math.floor(Math.random() * 1000000)}`);
  const classes = classnames('fb-radio-button', { disabled });
  return (
    <div className={classes} key={value}>
      <input
        id={id}
        type='radio'
        name={name}
        value={value}
        checked={checked}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={() => onChange(value)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
