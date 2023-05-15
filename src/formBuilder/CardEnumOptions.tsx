import React, { ReactElement } from 'react';
import { Input } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from './FontAwesomeIcon';

const useStyles = createUseStyles({
  cardEnumOption: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '.5em',
    '& input': { width: '80%', marginRight: '1em', marginBottom: 0 },
    '& .delete-button': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
});

interface CardEnumOptionsProps {
  initialValues: Array<any>;
  names?: Array<string>;
  showNames: boolean;
  onChange: (newEnums: Array<any>, newEnumNames?: Array<string>) => void;
  type: string;
}

// Input field corresponding to an array of values, add and remove
export default function CardEnumOptions({
  initialValues,
  names,
  showNames,
  onChange,
  type,
}: CardEnumOptionsProps): ReactElement {
  const classes = useStyles();

  const possibleValues = [];
  for (let index = 0; index < initialValues.length; index += 1) {
    const value = initialValues[index];
    let name = `${value}`;
    if (names && index < names.length) name = names[index];
    possibleValues.push(
      <div key={index} className={classes.cardEnumOption}>
        <Input
          value={value === undefined || value === null ? '' : value}
          placeholder='Possible Value'
          key={`val-${index}`}
          type={type === 'string' ? 'text' : 'number'}
          onChange={(ev: any) => {
            let newVal;
            switch (type) {
              case 'string':
                newVal = ev.target.value;
                break;
              case 'number':
              case 'integer':
                newVal = parseFloat(ev.target.value);
                if (Number.isInteger(newVal))
                  newVal = parseInt(ev.target.value, 10);
                // TODO: Possible unused condition, since we know it is a number or integer in this case.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (Number.isNaN(newVal)) newVal = type === 'string' ? '' : 0;
                break;
              default:
                throw new Error(`Enum called with unknown type ${type}`);
            }
            onChange(
              [
                ...initialValues.slice(0, index),
                newVal,
                ...initialValues.slice(index + 1),
              ],
              names,
            );
          }}
          className='card-text'
        />
        <Input
          value={name || ''}
          placeholder='Label'
          key={`name-${index}`}
          type='text'
          onChange={(ev: any) => {
            if (names)
              onChange(initialValues, [
                ...names.slice(0, index),
                ev.target.value,
                ...names.slice(index + 1),
              ]);
          }}
          className='card-text'
          style={{ display: showNames ? 'initial' : 'none' }}
        />
        <div className='delete-button'>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => {
              // remove this value
              onChange(
                [
                  ...initialValues.slice(0, index),
                  ...initialValues.slice(index + 1),
                ],
                names
                  ? [...names.slice(0, index), ...names.slice(index + 1)]
                  : undefined,
              );
            }}
          />
        </div>
      </div>,
    );
  }

  return (
    <React.Fragment>
      {possibleValues}
      <FontAwesomeIcon
        icon={faPlus}
        onClick={() => {
          // add a new dropdown option
          onChange(
            [...initialValues, type === 'string' ? '' : 0],
            names ? [...names, ''] : undefined,
          );
        }}
      />
    </React.Fragment>
  );
}
