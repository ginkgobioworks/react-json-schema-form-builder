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
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF !important',
  },
  hidden: {
    display: 'none',
  },
  inputField: {
    border: '1px solid #d1d5db',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    width: '100%',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    },
    transition: 'all 0.2s ease',
  },
  inputContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '32px',
    width: '103%',
    marginTop: '-32px',
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
    <div className={`card-enum ${classes.container}`}>
       <div className={classes.inputContainer}>
        <div>Expected Answer</div>
        <input
          className={classes.inputField}
          type='text'
          onChange={(ev) =>
            onChange({ ...parameters, expectedAnswer: ev.target.value })
          }
        />
      </div>
      <h3>Possible Values</h3>
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
