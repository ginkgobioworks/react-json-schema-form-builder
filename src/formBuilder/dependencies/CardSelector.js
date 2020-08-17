// @flow

import * as React from 'react';
import Select from 'react-select';

// a field that lets you choose adjacent blocks
export default function CardSelector({
  possibleChoices,
  chosenChoices,
  onChange,
  placeholder,
  path,
}: {
  possibleChoices: Array<string>,
  chosenChoices: Array<string>,
  onChange: (chosenChoices: Array<string>) => void,
  placeholder: string,
  path: string,
}) {
  return (
    <React.Fragment>
      <ul>
        {chosenChoices.map((chosenChoice, index) => (
          <li key={`${path}_neighbor_${index}`}>
            {chosenChoice}{' '}
            <i
              className="fa fa-times"
              onClick={() =>
                onChange([
                  ...chosenChoices.slice(0, index),
                  ...chosenChoices.slice(index + 1),
                ])
              }
            />
          </li>
        ))}
      </ul>
      <Select
        value={{
          value: '',
          label: '',
        }}
        placeholder={placeholder}
        options={possibleChoices
          .filter((choice) => !chosenChoices.includes(choice))
          .map((choice) => ({
            value: choice,
            label: choice,
          }))}
        onChange={(val: any) => {
          onChange([...chosenChoices, val.value]);
        }}
        className="card-modal-select"
      />
    </React.Fragment>
  );
}
