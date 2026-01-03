import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FBCheckbox from '../FBCheckbox';
import CardEnumOptions from '../CardEnumOptions';
import type {
  FormInput,
  CardComponentType,
  CardComponentPropsType,
} from '../types';

// specify the inputs required for a string type object
export const CardDefaultParameterInputs: CardComponentType = () => <div />;

const getInputCardBodyComponent = ({ type }: { type: string }) =>
  function InputCardBodyComponent({
    parameters,
    onChange,
  }: {
    parameters: CardComponentPropsType;
    onChange: (newParams: CardComponentPropsType) => void;
  }) {
    return (
      <>
        <Typography variant='subtitle2' fontWeight='bold'>
          Default Value
        </Typography>
        <TextField
          value={(parameters.default || '') as string | number}
          placeholder='Default'
          type={type}
          onChange={(ev) =>
            onChange({ ...parameters, default: ev.target.value })
          }
          size='small'
          fullWidth
        />
      </>
    );
  };

const Checkbox: CardComponentType = ({ parameters, onChange }) => {
  return (
    <FBCheckbox
      onChangeValue={() => {
        onChange({
          ...parameters,
          default: parameters.default ? parameters.default !== true : true,
        });
      }}
      isChecked={parameters.default ? parameters.default === true : false}
      label='Default'
    />
  );
};

function MultipleChoice({
  parameters,
  onChange,
}: {
  parameters: CardComponentPropsType;
  onChange: (newParams: CardComponentPropsType) => void;
}) {
  const enumArray = Array.isArray(parameters.enum) ? parameters.enum : [];

  const containsUnparsableString = enumArray.some((val) => {
    return isNaN(val as number);
  });
  const containsString =
    containsUnparsableString ||
    enumArray.some((val) => typeof val === 'string');
  const [isNumber, setIsNumber] = React.useState(
    !!enumArray.length && !containsString,
  );
  return (
    <>
      <Typography variant='subtitle2' fontWeight='bold'>
        Possible Values
      </Typography>
      <FBCheckbox
        onChangeValue={() => {
          if (Array.isArray(parameters.enumNames)) {
            // remove the enumNames
            onChange({
              ...parameters,
              enumNames: null,
            });
          } else {
            // create enumNames as a copy of enum values
            onChange({
              ...parameters,
              enumNames: enumArray.map((val) => `${val}`),
            });
          }
        }}
        isChecked={Array.isArray(parameters.enumNames)}
        label='Display label is different from value'
      />
      <Box
        sx={{
          display:
            containsUnparsableString || !enumArray.length ? 'none' : 'block',
        }}
      >
        <FBCheckbox
          onChangeValue={() => {
            if (containsString || !isNumber) {
              // attempt converting enum values into numbers
              try {
                const newEnum = enumArray.map((val) => {
                  let newNum = 0;
                  if (val) newNum = parseFloat(val as string) || 0;
                  if (Number.isNaN(newNum))
                    throw new Error(`Could not convert ${val}`);
                  return newNum;
                });
                setIsNumber(true);
                onChange({
                  ...parameters,
                  enum: newEnum,
                });
              } catch (error) {
                console.error(error);
              }
            } else {
              // convert enum values back into strings
              const newEnum = enumArray.map((val) => `${val || 0}`);
              setIsNumber(false);
              onChange({
                ...parameters,
                enum: newEnum,
              });
            }
          }}
          isChecked={isNumber}
          disabled={containsUnparsableString}
          label='Force number'
        />
      </Box>
      <CardEnumOptions
        initialValues={enumArray}
        names={
          Array.isArray(parameters.enumNames)
            ? parameters.enumNames.map((val) => `${val}`)
            : undefined
        }
        showNames={Array.isArray(parameters.enumNames)}
        onChange={(newEnum: Array<string>, newEnumNames?: Array<string>) =>
          onChange({
            ...parameters,
            enum: newEnum,
            enumNames: newEnumNames,
          })
        }
        type={isNumber ? 'number' : 'string'}
      />
    </>
  );
}

const defaultInputs: { [key: string]: FormInput } = {
  dateTime: {
    displayName: 'Date-Time',
    matchIf: [
      {
        types: ['string'],
        format: 'date-time',
      },
    ],
    defaultDataSchema: {
      format: 'date-time',
    },
    defaultUiSchema: {},
    type: 'string',
    cardBody: getInputCardBodyComponent({ type: 'datetime-local' }),
    modalBody: CardDefaultParameterInputs,
  },
  date: {
    displayName: 'Date',
    matchIf: [
      {
        types: ['string'],
        format: 'date',
      },
    ],
    defaultDataSchema: {
      format: 'date',
    },
    defaultUiSchema: {},
    type: 'string',
    cardBody: getInputCardBodyComponent({ type: 'date' }),
    modalBody: CardDefaultParameterInputs,
  },
  time: {
    displayName: 'Time',
    matchIf: [
      {
        types: ['string'],
        format: 'time',
      },
    ],
    defaultDataSchema: {
      format: 'time',
    },
    defaultUiSchema: {},
    type: 'string',
    cardBody: getInputCardBodyComponent({ type: 'time' }),
    modalBody: CardDefaultParameterInputs,
  },
  checkbox: {
    displayName: 'Checkbox',
    matchIf: [
      {
        types: ['boolean'],
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {},
    type: 'boolean',
    cardBody: Checkbox,
    modalBody: CardDefaultParameterInputs,
  },
  radio: {
    displayName: 'Radio',
    matchIf: [
      {
        types: ['string', 'number', 'integer', 'array', 'boolean', 'null'],
        widget: 'radio',
        enum: true,
      },
    ],
    defaultDataSchema: { enum: [] },
    defaultUiSchema: {
      'ui:widget': 'radio',
    },
    type: 'string',
    cardBody: MultipleChoice,
    modalBody: CardDefaultParameterInputs,
  },
  dropdown: {
    displayName: 'Dropdown',
    matchIf: [
      {
        types: ['string', 'number', 'integer', 'array', 'boolean', 'null'],
        enum: true,
      },
    ],
    defaultDataSchema: { enum: [] },
    defaultUiSchema: {},
    type: 'string',
    cardBody: MultipleChoice,
    modalBody: CardDefaultParameterInputs,
  },
};

export default defaultInputs;
