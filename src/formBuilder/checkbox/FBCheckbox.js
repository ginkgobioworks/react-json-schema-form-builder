// @flow

import React from 'react';
import classnames from 'classnames';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  checkbox: {
    '& *': {
      display: 'inline-block',
    },
    '& input': {
      marginRight: '5px',
    },
  },
});

type Props = {
  onChangeValue: Function,
  isChecked: boolean,
  id?: string,
  label?: string,
  use?: string,
  value?: string,
  disabled?: boolean,
  dataTest?: string,
  labelClassName?: string,
};

const FBCheckbox = ({
  onChangeValue,
  value = '',
  isChecked = false,
  label = '',
  use = 'action',
  disabled = false,
  id = '',
  dataTest = '',
  labelClassName = '',
}: Props) => {
  const classjss = useStyles();
  const classes = classnames('fb-checkbox', {
    'edit-checkbox': !disabled && use === 'edit',
    'action-checkbox': !disabled && use === 'action',
    'disabled-checked-checkbox': disabled && isChecked,
    'disabled-unchecked-checkbox': disabled && !isChecked,
  });
  const potentialCheckboxId = id !== '' ? id : label;
  const checkboxId = potentialCheckboxId !== '' ? potentialCheckboxId : null;
  return (
    <div data-test="checkbox" className={`${classes} ${classjss.checkbox}`}>
      <input
        type="checkbox"
        id={checkboxId}
        data-test={dataTest || undefined}
        onChange={disabled ? () => {} : onChangeValue}
        value={value}
        disabled={disabled}
        checked={isChecked}
      />
      <div className="checkbox-overlay">
        {label && (
          <label htmlFor={checkboxId} className={labelClassName || undefined}>
            {label}
          </label>
        )}
      </div>
    </div>
  );
};

export default FBCheckbox;
