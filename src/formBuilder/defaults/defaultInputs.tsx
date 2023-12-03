import React from 'react';
import { Input } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import FBCheckbox from '../checkbox/FBCheckbox';
import CardEnumOptions from '../CardEnumOptions';
import { getRandomId } from '../utils';
import type {
  FormInput,
  CardComponentType,
  CardComponentPropsType,
} from '../types';
import { InputType } from 'reactstrap/types/lib/Input';

const useStyles = createUseStyles({
  hidden: {
    display: 'none',
  },
});

// specify the inputs required for a string type object
export const CardDefaultParameterInputs: CardComponentType = () => <div />;

const getInputCardBodyComponent = ({ type }: { type: InputType }) =>
  function InputCardBodyComponent({
    parameters,
    onChange,
  }: {
    parameters: CardComponentPropsType;
    onChange: (newParams: CardComponentPropsType) => void;
  }) {
    return (
      <React.Fragment>
        <h5>Default value</h5>
        <Input
          value={(parameters.default || '') as string | number}
          placeholder='Default'
          type={type}
          onChange={(ev) =>
            onChange({ ...parameters, default: ev.target.value })
          }
          className='card-text'
        />
      </React.Fragment>
    );
  };

const Checkbox: CardComponentType = ({ parameters, onChange }) => {
  return (
    <div className='card-boolean'>
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
    </div>
  );
};

function MultipleChoice({
  parameters,
  onChange,
}: {
  parameters: CardComponentPropsType;
  onChange: (newParams: CardComponentPropsType) => void;
}) {
  const classes = useStyles();
  const enumArray = Array.isArray(parameters.enum) ? parameters.enum : [];
  // eslint-disable-next-line no-restricted-globals
  const containsUnparsableString = enumArray.some((val) => {
    return isNaN(val as number);
  });
  const containsString =
    containsUnparsableString ||
    enumArray.some((val) => typeof val === 'string');
  const [isNumber, setIsNumber] = React.useState(
    !!enumArray.length && !containsString,
  );
  const [elementId] = React.useState(getRandomId());
  return (
    <div className='card-enum'>
      <h3>Possible Values</h3>
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
        id={`${elementId}_different`}
      />
      <div
        className={
          containsUnparsableString || !enumArray.length ? classes.hidden : ''
        }
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
                // eslint-disable-next-line no-console
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
          id={`${elementId}_forceNumber`}
        />
      </div>
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
    </div>
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
