import React, { ReactElement } from 'react';
import Select from 'react-select';
import { Input, FormGroup, FormFeedback } from 'reactstrap';
import classnames from 'classnames';
import GeneralParameterInputs from './GeneralParameterInputs';
import {
  defaultUiProps,
  defaultDataProps,
  categoryToNameMap,
  categoryType,
  subtractArray,
  getRandomId,
} from './utils';
import type {
  Mods,
  ModLabels,
  FormInput,
  CardComponentPropsType,
} from './types';
import Tooltip from './Tooltip';

// specify the inputs required for any type of object
export default function CardGeneralParameterInputs({
  parameters,
  onChange,
  allFormInputs,
  mods,
  showObjectNameInput = true,
}: {
  parameters: CardComponentPropsType;
  onChange: (newParams: CardComponentPropsType) => void;
  mods?: Mods;
  allFormInputs: { [key: string]: FormInput };
  showObjectNameInput?: boolean;
}): ReactElement {
  const [keyState, setKeyState] = React.useState(parameters.name);
  const [keyError, setKeyError] = React.useState<null | string>(null);
  const [titleState, setTitleState] = React.useState(parameters.title);
  const [descriptionState, setDescriptionState] = React.useState(
    parameters.description,
  );
  const [elementId] = React.useState(getRandomId());
  const categoryMap = categoryToNameMap(allFormInputs);

  const fetchLabel = (
    labelName: string,
    defaultLabel: string,
  ): string | undefined => {
    return mods &&
      mods.labels &&
      typeof mods.labels[labelName as keyof ModLabels] === 'string'
      ? mods.labels[labelName as keyof ModLabels]
      : defaultLabel;
  };

  const objectNameLabel = fetchLabel('objectNameLabel', 'Object Name');
  const displayNameLabel = fetchLabel('displayNameLabel', 'Display Name');
  const descriptionLabel = fetchLabel('descriptionLabel', 'Description');
  const inputTypeLabel = fetchLabel('inputTypeLabel', 'Input Type');

  const availableInputTypes = () => {
    const definitionsInSchema =
      parameters.definitionData &&
      Object.keys(parameters.definitionData).length !== 0;

    // Hide the "Reference" option if there are no definitions in the schema
    let inputKeys = Object.keys(categoryMap).filter(
      (key) => key !== 'ref' || definitionsInSchema,
    );
    // Exclude hidden inputs based on mods
    if (mods) inputKeys = subtractArray(inputKeys, mods.deactivatedFormInputs);

    return inputKeys
      .map((key) => ({ value: key, label: categoryMap[key] }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  return (
    <React.Fragment>
      <div className='card-entry-row'>
        {showObjectNameInput && (
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
                id={`${elementId}_nameinfo`}
                type='help'
              />
            </h5>

            <FormGroup>
              <Input
                invalid={keyError !== null}
                value={keyState || ''}
                placeholder='Key'
                type='text'
                onChange={(ev) => setKeyState(ev.target.value)}
                onBlur={(ev) => {
                  const { value } = ev.target;
                  if (
                    value === parameters.name ||
                    !(
                      parameters.neighborNames &&
                      parameters.neighborNames.includes(value)
                    )
                  ) {
                    setKeyError(null);
                    onChange({
                      ...parameters,
                      name: value,
                    });
                  } else {
                    setKeyState(parameters.name);
                    setKeyError(`"${value}" is already in use.`);
                    onChange({ ...parameters });
                  }
                }}
                className='card-text'
              />
              <FormFeedback>{keyError}</FormFeedback>
            </FormGroup>
          </div>
        )}
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
              id={`${elementId}-titleinfo`}
              type='help'
            />
          </h5>
          <Input
            value={titleState || ''}
            placeholder='Title'
            type='text'
            onChange={(ev) => setTitleState(ev.target.value)}
            onBlur={(ev) => {
              onChange({ ...parameters, title: ev.target.value });
            }}
            className='card-text'
          />
        </div>
      </div>
      <div className='card-entry-row'>
        <div
          className={`card-entry ${parameters.$ref ? 'disabled-input' : ''}`}
        >
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
              id={`${elementId}-descriptioninfo`}
              type='help'
            />
          </h5>
          <FormGroup>
            <Input
              value={descriptionState || ''}
              placeholder='Description'
              type='text'
              onChange={(ev) => setDescriptionState(ev.target.value)}
              onBlur={(ev) => {
                onChange({ ...parameters, description: ev.target.value });
              }}
              className='card-text'
            />
          </FormGroup>
        </div>
        <div
          className={classnames('card-entry', {
            'wide-card-entry': !showObjectNameInput,
          })}
        >
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
              id={`${elementId}-inputinfo`}
              type='help'
            />
          </h5>
          <Select
            value={{
              value: parameters.category,
              label: categoryMap[parameters.category!],
            }}
            placeholder={inputTypeLabel}
            options={availableInputTypes()}
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
                const firstDefinition = Object.keys(
                  parameters.definitionData!,
                )[0];
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
      </div>

      <div className='card-category-options'>
        <GeneralParameterInputs
          category={parameters.category!}
          parameters={parameters}
          onChange={onChange}
          mods={mods}
          allFormInputs={allFormInputs}
        />
      </div>
    </React.Fragment>
  );
}
