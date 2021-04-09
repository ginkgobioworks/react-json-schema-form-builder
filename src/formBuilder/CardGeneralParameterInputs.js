// @flow

import React from 'react';
import Select from 'react-select';
import { Input } from 'reactstrap';
import GeneralParameterInputs from './GeneralParameterInputs';
import {
  defaultUiProps,
  defaultDataProps,
  categoryToNameMap,
  categoryType,
} from './utils';
import type { Parameters, Mods, FormInput } from './types';
import Tooltip from './Tooltip';

// specify the inputs required for any type of object
export default function CardGeneralParameterInputs({
  parameters,
  onChange,
  allFormInputs,
  mods,
}: {
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
  mods?: Mods,
  allFormInputs: { [string]: FormInput },
}) {
  const [keyState, setKeyState] = React.useState(parameters.name);
  const [titleState, setTitleState] = React.useState(parameters.title);
  const [descriptionState, setDescriptionState] = React.useState(
    parameters.description,
  );
  const categoryMap = categoryToNameMap(parameters.category, allFormInputs);

  const fetchLabel = (labelName: string, defaultLabel: string): string => {
    return mods && mods.labels && typeof mods.labels[labelName] === 'string'
      ? mods.labels[labelName]
      : defaultLabel;
  };

  const objectNameLabel = fetchLabel('objectNameLabel', 'Object Name');
  const displayNameLabel = fetchLabel('displayNameLabel', 'Display Name');
  const descriptionLabel = fetchLabel('descriptionLabel', 'Description');
  const inputTypeLabel = fetchLabel('inputTypeLabel', 'Input Type');

  return (
    <div>
      <div className='card-entry'>
        <h5>
          {`${objectNameLabel} `}
          <Tooltip
            text={
              mods &&
              mods.tooltipDescriptions &&
              typeof mods.tooltipDescriptions.cardObjectName === 'string'
                ? mods.tooltipDescriptions.cardObjectName
                : 'The back-end name of the object'
            }
            id={`${(keyState: string)}_nameinfo`}
            type='help'
          />
        </h5>

        <Input
          value={keyState || ''}
          placeholder='Key'
          type='text'
          onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
            setKeyState(ev.target.value.replace(/\W/g, '_'))
          }
          onBlur={(ev: SyntheticInputEvent<HTMLInputElement>) =>
            onChange({
              ...parameters,
              name: ev.target.value,
            })
          }
          className='card-text'
        />
      </div>
      <div
        className={`card-entry ${
          parameters.$ref === undefined ? '' : 'disabled-input'
        }`}
      >
        <h5>
          {`${displayNameLabel} `}
          <Tooltip
            text={
              mods &&
              mods.tooltipDescriptions &&
              typeof mods.tooltipDescriptions.cardDisplayName === 'string'
                ? mods.tooltipDescriptions.cardDisplayName
                : 'The user-facing name of this object'
            }
            id={`${(keyState: string)}-titleinfo`}
            type='help'
          />
        </h5>
        <Input
          value={titleState || ''}
          placeholder='Title'
          type='text'
          onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
            setTitleState(ev.target.value)
          }
          onBlur={(ev: SyntheticInputEvent<HTMLInputElement>) => {
            onChange({ ...parameters, title: ev.target.value });
          }}
          className='card-text'
        />
      </div>
      <div className={`card-entry ${parameters.$ref ? 'disabled-input' : ''}`}>
        <h5>
          {`${descriptionLabel} `}
          <Tooltip
            text={
              mods &&
              mods.tooltipDescriptions &&
              typeof mods.tooltipDescriptions.cardDescription === 'string'
                ? mods.tooltipDescriptions.cardDescription
                : 'This will appear as help text on the form'
            }
            id={`${(keyState: string)}-descriptioninfo`}
            type='help'
          />
        </h5>
        <Input
          value={descriptionState || ''}
          placeholder='Description'
          type='text'
          onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
            setDescriptionState(ev.target.value)
          }
          onBlur={(ev: SyntheticInputEvent<HTMLInputElement>) => {
            onChange({ ...parameters, description: ev.target.value });
          }}
          className='card-text'
        />
      </div>
      <div className='card-entry'>
        <h5>
          {`${inputTypeLabel} `}
          <Tooltip
            text={
              mods &&
              mods.tooltipDescriptions &&
              typeof mods.tooltipDescriptions.cardInputType === 'string'
                ? mods.tooltipDescriptions.cardInputType
                : 'The type of form input displayed on the form'
            }
            id={`${(keyState: string)}-inputinfo`}
            type='help'
          />
        </h5>
        <Select
          value={{
            value: parameters.category,
            label: categoryMap[parameters.category],
          }}
          placeholder='Category'
          options={Object.keys(categoryMap)
            .filter(
              (key) =>
                key !== 'ref' ||
                (parameters.definitionData &&
                  Object.keys(parameters.definitionData).length !== 0),
            )
            .map((key) => ({
              value: key,
              label: categoryMap[key],
            }))}
          onChange={(val: any) => {
            // figure out the new 'type'
            const newCategory = val.value;

            const newProps = {
              ...defaultUiProps(newCategory, allFormInputs),
              ...defaultDataProps(newCategory, allFormInputs),
              name: parameters.name,
              required: parameters.required,
            };
            if (newProps.$ref !== undefined && !newProps.$ref) {
              // assign an initial reference
              const firstDefinition = Object.keys(parameters.definitionData)[0];
              newProps.$ref = `#/definitions/${firstDefinition || 'empty'}`;
            }
            onChange({
              ...newProps,
              title: newProps.title || parameters.title,
              default: newProps.default || '',
              type: newProps.type || categoryType(newCategory, allFormInputs),
              category: newProps.category || newCategory,
            });
          }}
          className='card-select'
        />
      </div>
      <div className='card-category-options'>
        <GeneralParameterInputs
          category={parameters.category}
          parameters={parameters}
          onChange={onChange}
          mods={mods}
          allFormInputs={allFormInputs}
        />
      </div>
    </div>
  );
}
