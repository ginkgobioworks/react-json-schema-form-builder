import React, { ReactElement } from 'react';
import { Input } from 'reactstrap';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  actionButtonContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonContainer: {
    cursor: 'pointer',
    border: '1px solid #E4E4E7',
    borderRadius: '8px',
    padding: '10px'
  },
  cardEnumOption: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: '.5em',
    '& input': { width: '25%', marginRight: '1em', marginBottom: 0, border: '1px solid #E4E4E7 !important', padding: '10px', borderRadius: '8px !important', paddingLeft: '15px'},
    '& .delete-button': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
});

const PlusIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8C11 7.44772 11.4477 7 12 7Z'
      fill='#09090B'
    />
  </svg>
);

const CrossIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
      fill='#DC2626'
    />
  </svg>
);

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
          placeholder='Enter a value'
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
        <div className={classes.actionButtonContainer}>
          <div
            className={classes.addButtonContainer}
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
          >
            <CrossIcon />
          </div>
          <div
            className={classes.addButtonContainer}
            onClick={() => {
              onChange(
                [...initialValues, type === 'string' ? '' : 0],
                names ? [...names, ''] : undefined,
              );
            }}
          >
            <PlusIcon />
          </div>
        </div>
      </div>,
    );
  }

  return (
    <React.Fragment>
      {possibleValues}
      {possibleValues.length === 0 && <div
        className={classes.addButtonContainer}
        onClick={() => {
          onChange(
            [...initialValues, type === 'string' ? '' : 0],
            names ? [...names, ''] : undefined,
          );
        }}
      >
        <PlusIcon />
      </div>}
    </React.Fragment>
  );
}
