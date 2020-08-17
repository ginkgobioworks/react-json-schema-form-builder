// @flow
import * as React from 'react';
import { Input } from 'reactstrap';
import Select from 'react-select';
import FBCheckbox from '../checkbox/FBCheckbox';
import CardEnumOptions from '../CardEnumOptions';
import type { Parameters } from '../types';

// specify the inputs required for a string type object
export function CardDefaultParameterInputs() {
  return <div></div>;
}

function TimeField({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
  return (
    <React.Fragment>
      <h5>Default time</h5>
      <Input
        value={parameters.default || ''}
        placeholder="Default"
        type="datetime-local"
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
          onChange({ ...parameters, default: ev.target.value })
        }
        className="card-text"
      />
    </React.Fragment>
  );
}

function Checkbox({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
  return (
    <div className="card-boolean">
      <FBCheckbox
        onChangeValue={() => {
          onChange({
            ...parameters,
            default: parameters.default ? parameters.default !== true : true,
          });
        }}
        isChecked={parameters.default ? parameters.default === true : false}
        label="Default"
      />
    </div>
  );
}

function MultipleChoice({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
  const enumArray = Array.isArray(parameters.enum) ? parameters.enum : [];
  // eslint-disable-next-line no-restricted-globals
  const containsUnparsableString = enumArray.some((val) => isNaN(val));
  const containsString =
    containsUnparsableString ||
    enumArray.some((val) => typeof val === 'string');
  const [isNumber, setIsNumber] = React.useState(
    !!enumArray.length && !containsString
  );
  return (
    <div className="card-enum">
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
        label="Display label is different from value"
        id={`${parameters.path}_different`}
      />
      <div
        style={{
          display:
            containsUnparsableString || !enumArray.length ? 'none' : 'initial',
        }}
      >
        <FBCheckbox
          onChangeValue={() => {
            if (containsString || !isNumber) {
              // attempt converting enum values into numbers
              try {
                const newEnum = enumArray.map((val) => {
                  let newNum = 0;
                  if (val) newNum = parseFloat(val) || 0;
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
          label="Force number"
          id={`${
            typeof parameters.path === 'string' ? parameters.path : ''
          }_forceNumber`}
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

function RefChoice({
  parameters,
  onChange,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
}) {
  return (
    <div className="card-select">
      <Select
        value={{
          value: parameters.$ref,
          label: parameters.$ref,
        }}
        placeholder="Reference"
        options={Object.keys(parameters.definitionData || {}).map((key) => ({
          value: `#/definitions/${key}`,
          label: `#/definitions/${key}`,
        }))}
        onChange={(val: any) => {
          onChange({ ...parameters, $ref: val.value });
        }}
        className="card-select"
      />
    </div>
  );
}

const defaultInputs = {
  time: {
    displayName: 'Time',
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
    cardBody: TimeField,
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
  ref: {
    displayName: 'Reference',
    matchIf: [
      {
        types: [null],
        $ref: true,
      },
    ],
    defaultDataSchema: {
      $ref: '',
    },
    defaultUiSchema: {},
    type: null,
    cardBody: RefChoice,
    modalBody: CardDefaultParameterInputs,
  },
  radio: {
    displayName: 'Radio',
    matchIf: [
      {
        types: ['string', 'number', 'integer', 'array', 'boolean', null],
        widget: 'radio',
        enum: true,
      },
    ],
    defaultDataSchema: { enum: [] },
    defaultUiSchema: {
      'ui:widget': 'radio',
    },
    type: null,
    cardBody: MultipleChoice,
    modalBody: CardDefaultParameterInputs,
  },
  dropdown: {
    displayName: 'Dropdown',
    matchIf: [
      {
        types: ['string', 'number', 'integer', 'array', 'boolean', null],
        enum: true,
      },
    ],
    defaultDataSchema: { enum: [] },
    defaultUiSchema: {},
    type: null,
    cardBody: MultipleChoice,
    modalBody: CardDefaultParameterInputs,
  },
};

export default defaultInputs;
