import React, { ReactElement } from 'react';
import classnames from 'classnames';
import { createUseStyles } from 'react-jss';
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

type FBRadioGroupPropsType = {
  options: Array<{ label: string | ReactElement; value: string | number }>;
  onChange: (selection: string) => void;
  defaultValue?: any;
  horizontal?: boolean;
  id?: string | number;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
};

export default function FBRadioGroup(
  props: FBRadioGroupPropsType,
): ReactElement {
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

  // Conditionallly add 'id' prop in case id was not passed in from parent.
  let elementId = {};
  if (id) {
    elementId = { id };
  }

  return (
    <div {...elementId} className={`${classes} ${classjss.radio}`}>
      {options.map((option, index) => (
        <FBRadioButton
          value={option.value}
          label={option.label}
          {...elementId}
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
