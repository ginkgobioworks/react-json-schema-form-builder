// @flow

import React from 'react';
import classnames from 'classnames';

type Props = {
  label: string | number,
  value?: any,
  name?: string,
  checked?: boolean,
  required?: boolean,
  disabled?: boolean,
  autoFocus?: boolean,
  children?: any,
  onChange: (any) => void,
};

export default function FBRadioButton(props: Props) {
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
  const classes = classnames('fb-radio-button', { disabled });
  return (
    <label className={classes} key={value}>
      {props.children}
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={() => onChange(value)}
      />
      <span className="fb-custom-radio-button" />
      {label}
    </label>
  );
}
