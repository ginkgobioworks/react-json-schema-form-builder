import React, { useState, ReactElement } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { getRandomId } from '../utils';

// a field that lets you choose adjacent blocks
export default function CardSelector({
  possibleChoices,
  chosenChoices,
  onChange,
  placeholder,
}: {
  possibleChoices: Array<string>;
  chosenChoices: Array<string>;
  onChange: (chosenChoices: Array<string>) => void;
  placeholder: string;
}): ReactElement {
  const [elementId] = useState(getRandomId());
  return (
    <>
      <ul>
        {chosenChoices.map((chosenChoice, index) => (
          <li key={`${elementId}_neighbor_${index}`}>
            {chosenChoice}{' '}
            <CloseIcon
              fontSize='small'
              sx={{ cursor: 'pointer', verticalAlign: 'middle' }}
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
      <Autocomplete
        value={null}
        options={possibleChoices
          .filter((choice) => !chosenChoices.includes(choice))
          .map((choice) => ({
            value: choice,
            label: choice,
          }))}
        getOptionLabel={(option) => option.label}
        onChange={(_, val) => {
          if (val) onChange([...chosenChoices, val.value]);
        }}
        size='small'
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} />
        )}
      />
    </>
  );
}
