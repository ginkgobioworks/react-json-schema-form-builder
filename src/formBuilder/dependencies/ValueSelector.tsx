import React, { useState, ReactElement } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CardEnumOptions from '../CardEnumOptions';
import CardSelector from './CardSelector';
import FBCheckbox from '../FBCheckbox';
import { getRandomId } from '../utils';

type combinationValue = string | number | any[] | { [key: string]: any };

// handle value options for different card types
export default function ValueSelector({
  possibility,
  onChange,
  parentEnums,
  parentType,
  parentName,
  parentSchema,
}: {
  possibility: {
    children: Array<string>;
    value?: any;
  };
  onChange: (newPossibility: { children: Array<string>; value?: any }) => void;
  parentEnums?: Array<string | number>;
  parentType?: string;
  parentName?: string;
  parentSchema?: any;
}): ReactElement {
  const [elementId] = useState(getRandomId());
  if (possibility.value) {
    // enum type
    if (parentEnums) {
      const enumType = typeof parentEnums[0] === 'number' ? 'number' : 'string';
      if (enumType === 'string')
        return (
          <CardSelector
            possibleChoices={parentEnums.map((val) => `${val}`)}
            chosenChoices={possibility.value.enum}
            onChange={(chosenChoices: Array<string>) =>
              onChange({ ...possibility, value: { enum: chosenChoices } })
            }
            placeholder='Allowed value'
          />
        );
      if (enumType === 'number')
        return (
          <CardSelector
            possibleChoices={parentEnums.map((val) => `${val}`)}
            chosenChoices={possibility.value.enum}
            onChange={(chosenChoices: Array<string>) =>
              onChange({
                ...possibility,
                value: {
                  enum: chosenChoices.map((val) => Number.parseFloat(val)),
                },
              })
            }
            placeholder='Allowed value'
          />
        );
    }
    // check box type
    if (parentType === 'boolean') {
      return (
        <FBCheckbox
          onChangeValue={() => {
            if (possibility.value.enum && possibility.value.enum[0]) {
              onChange({
                ...possibility,
                value: { enum: [false] },
              });
            } else {
              onChange({
                ...possibility,
                value: { enum: [true] },
              });
            }
          }}
          isChecked={possibility.value.enum && possibility.value.enum[0]}
          label={parentName}
        />
      );
    }
    // object type
    if (parentType === 'object') {
      const enumArr: Array<{
        [key: string]: combinationValue;
      }> = possibility.value.enum;

      const getInput = (
        val: string | number | any[] | { [key: string]: any },
        index: number,
        key: string,
      ) => {
        switch (typeof val) {
          case 'string':
            return (
              <TextField
                value={val || ''}
                placeholder='String value'
                type='text'
                onChange={(ev: any) => {
                  const newVal = ev.target.value;
                  const oldCombo = possibility.value.enum[index];
                  onChange({
                    ...possibility,
                    value: {
                      enum: [
                        ...enumArr.slice(0, index),
                        { ...oldCombo, [key]: newVal },
                        ...enumArr.slice(index + 1),
                      ],
                    },
                  });
                }}
                size='small'
                fullWidth
              />
            );
          case 'number':
            return (
              <TextField
                value={val || ''}
                placeholder='Number value'
                type='number'
                onChange={(ev: any) => {
                  const newVal = Number.parseFloat(ev.target.value);
                  const oldCombo = possibility.value.enum[index];
                  onChange({
                    ...possibility,
                    value: {
                      enum: [
                        ...enumArr.slice(0, index),
                        { ...oldCombo, [key]: newVal },
                        ...enumArr.slice(index + 1),
                      ],
                    },
                  });
                }}
                size='small'
                fullWidth
              />
            );
          case 'object':
            return (
              <TextField
                value={JSON.stringify(val) || ''}
                placeholder='Object in JSON'
                multiline
                onChange={(ev: any) => {
                  let newVal = val;
                  try {
                    newVal = JSON.parse(ev.target.value);
                  } catch {
                    console.error('invalid JSON object input');
                  }
                  const oldCombo = possibility.value.enum[index];
                  onChange({
                    ...possibility,
                    value: {
                      enum: [
                        ...enumArr.slice(0, index),
                        { ...oldCombo, [key]: newVal },
                        ...enumArr.slice(index + 1),
                      ],
                    },
                  });
                }}
                size='small'
                fullWidth
              />
            );
        }
      };

      return (
        <Box>
          {enumArr.map((combination, index) => (
            <Box component='li' key={`${elementId}_possibleValue${index}`}>
              {Object.keys(combination).map((key) => {
                const val: combinationValue = combination[key];
                return (
                  <Box key={key}>
                    <Typography variant='subtitle2' fontWeight='bold'>
                      {key}:
                    </Typography>
                    {getInput(val, index, key)}
                  </Box>
                );
              })}
              <CloseIcon
                sx={{ cursor: 'pointer' }}
                onClick={() =>
                  onChange({
                    ...possibility,
                    value: {
                      enum: [
                        ...enumArr.slice(0, index),
                        ...enumArr.slice(index + 1),
                      ],
                    },
                  })
                }
              />
            </Box>
          ))}
          <AddIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              const newCase: { [key: string]: any } = {};
              const propArr: { [key: string]: any } = parentSchema
                ? parentSchema.properties
                : {};
              Object.keys(propArr).forEach((key) => {
                if (
                  propArr[key].type === 'number' ||
                  propArr[key].type === 'integer'
                ) {
                  newCase[key] = 0;
                } else if (propArr[key].type === 'array' || propArr[key].enum) {
                  newCase[key] = [];
                } else if (
                  propArr[key].type === 'object' ||
                  propArr[key].properties
                ) {
                  newCase[key] = {};
                } else {
                  newCase[key] = '';
                }
              });
              onChange({
                ...possibility,
                value: { enum: [...enumArr, newCase] },
              });
            }}
          />
        </Box>
      );
    }
    return (
      <CardEnumOptions
        initialValues={possibility.value.enum}
        onChange={(newEnum: Array<any>) =>
          onChange({ ...possibility, value: { enum: newEnum } })
        }
        type={parentType || 'string'}
        showNames={false}
      />
    );
  } else {
    return (
      <Typography variant='subtitle2' color='text.secondary'>
        Appear if defined
      </Typography>
    );
  }
}
