// @flow

import React, { useState } from 'react';
import classnames from 'classnames';
import type { Node } from 'react';

type Props = {
  label: Node,
  value?: any,
  name?: string,
  checked?: boolean,
  required?: boolean,
  disabled?: boolean,
  autoFocus?: boolean,
  onChange: (any) => void,
};

export default function FBRadioButton(props: Props): Node {
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
