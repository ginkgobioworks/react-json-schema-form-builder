import React, { useState, ReactElement } from 'react';
import classnames from 'classnames';
import { createUseStyles } from 'react-jss';

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

const useStyles = createUseStyles({
  radioButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '& input[type="radio"]': {
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      width: '16px',
      height: '16px',
      border: '2px solid #ccc',
      borderRadius: '50%',
      outline: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s ease',
      '&:checked': {
        backgroundColor: 'black',
        borderColor: 'black',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'white',
        }
      },
      '&:focus-visible': {
        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.2)',
      },
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      }
    },
    '& label': {
      cursor: 'pointer',
      userSelect: 'none',
    },
    '&.disabled': {
      opacity: 0.6,
      pointerEvents: 'none',
    }
  }
});

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
  const styles = useStyles();
  const classes = classnames(styles.radioButton, { disabled });
  
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