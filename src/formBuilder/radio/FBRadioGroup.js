// @flow

import React from 'react';
import classnames from 'classnames';
import { createUseStyles } from 'react-jss';
import type { Node } from 'react';
import FBRadioButton from './FBRadioButton';

const useStyles = createUseStyles({
  radio: {
    '& .fb-radio-button': {
      display: 'block',
      '& input[type="radio"]': {
        marginRight: '5px',
        marginBottom: 0,
        height: '1em',
        verticalAlign: 'middle',
      },
      '& input[type="radio"] + label': {
        marginTop: 0,
        marginBottom: 0,
        verticalAlign: 'middle',
      },
    },
  },
});

type Props = {
  options: Array<{ label: Node, value: string | number }>,
  defaultValue?: any,
  horizontal?: boolean,
  id?: string,
  required?: boolean,
  disabled?: boolean,
  autoFocus?: boolean,
  onChange: (any) => void,
};

export default function FBRadioGroup(props: Props): Node {
  const {
    options,
    defaultValue,
    onChange,
    horizontal,
    id,
    autoFocus,
    disabled,
  } = props;
  const name = Math.random().toString();
  const classjss = useStyles();
  const classes = classnames('fb-radio-group', {
    horizontal,
  });
  return (
    <div id={id} className={`${classes} ${classjss.radio}`}>
      {options.map((option, index) => (
        <FBRadioButton
          value={option.value}
          label={option.label}
          id={id}
          name={name}
          key={option.value}
          checked={option.value === defaultValue}
          autoFocus={autoFocus && index === 1}
          onChange={onChange}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
