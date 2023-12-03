import React, { useState, ReactElement } from 'react';
import { Input } from 'reactstrap';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import CardEnumOptions from '../CardEnumOptions';
import CardSelector from './CardSelector';
import FBCheckbox from '../checkbox/FBCheckbox';
import FontAwesomeIcon from '../FontAwesomeIcon';
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
              <Input
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
                className='card-modal-text'
              />
            );
            break;
          case 'number':
            return (
              <Input
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
                className='card-modal-number'
              />
            );
            break;
          // TODO: arrays are classified as objects - this may be unreachable code.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          case 'array':
            return (
              <Input
                value={JSON.stringify(val) || ''}
                placeholder='Array in JSON'
                type='textarea'
                onChange={(ev: any) => {
                  let newVal = val;
                  try {
                    newVal = JSON.parse(ev.target.value);
                  } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('invalid JSON array input');
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
                className='card-modal-text'
              />
            );
            break;
          case 'object':
            return (
              <Input
                value={JSON.stringify(val) || ''}
                placeholder='Object in JSON'
                type='textarea'
                onChange={(ev: any) => {
                  let newVal = val;
                  try {
                    newVal = JSON.parse(ev.target.value);
                  } catch (error) {
                    // eslint-disable-next-line no-console
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
                className='card-modal-text'
              />
            );
            break;
        }
      };

      return (
        <div>
          {enumArr.map((combination, index) => (
            <li key={`${elementId}_possibleValue${index}`}>
              {Object.keys(combination).map((key) => {
                const val: combinationValue = combination[key];
                return (
                  <div key={key}>
                    <h5>{key}:</h5>
                    {getInput(val, index, key)}
                  </div>
                );
              })}
              <FontAwesomeIcon
                icon={faTimes}
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
            </li>
          ))}
          <FontAwesomeIcon
            icon={faPlus}
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
        </div>
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
    return <h5> Appear if defined </h5>;
  }
}
