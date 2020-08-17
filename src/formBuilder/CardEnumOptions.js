// @flow

import * as React from 'react';
import { Input } from 'reactstrap';

// Input field corresponding to an array of values, add and remove
export default function CardEnumOptions({
  initialValues,
  names,
  showNames,
  onChange,
  type,
}: {
  initialValues: Array<any>,
  names?: Array<string>,
  showNames: boolean,
  onChange: (newEnums: Array<any>, newEnumNames?: Array<string>) => void,
  type: string,
}) {
  const possibleValues = [];
  for (let index = 0; index < initialValues.length; index += 1) {
    const value = initialValues[index];
    let name = `${value}`;
    if (names && index < names.length) name = names[index];
    possibleValues.push(
      <div key={index} className='card-enum-option'>
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
          placeholder='Name'
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
        <i
          className='fa fa-trash'
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
      </div>,
    );
  }

  return (
    <React.Fragment>
      <div className='card-enum-header'>
        <p> Value </p>
        <h5 style={{ display: showNames ? 'initial' : 'none' }}>
          {' '}
          Display Label{' '}
        </h5>
      </div>
      {possibleValues}
      <i
        className='fa fa-plus'
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
