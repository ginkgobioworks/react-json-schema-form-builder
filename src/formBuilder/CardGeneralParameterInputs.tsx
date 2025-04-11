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
import { createUseStyles } from 'react-jss';

// Define the styles using JSS
const useStyles = createUseStyles({
  inputContainer: {
    display: 'flex',
    gap: '8px',
  },
  inputField: {
    padding: '7px 8px',
    borderRadius: '4px',
    border: '1px solid #E4E4E7 !important',
    outline: 'none',
    fontSize: '14px',
    '&:focus': {
      borderColor: '#E4E4E7',
      outline: 'none',
    },
  },
  invalidInput: {
    borderColor: 'red',
    '&:focus': {
      borderColor: 'darkred', 
    },
  },
  formGroup: {
    marginBottom: '16px',
  },
  cardEntry: {
    marginBottom: '16px',
    width: '100%',
  },
  cardEntryRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    width: '100%',
    alignItems: 'center',
    marginTop: '16px',
  },
  wideCardEntry: {
    width: '100%',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left'
  },
  tooltip: {
    marginLeft: '5px',
    cursor: 'pointer',
  },
});

const customSelectStyles = {
  container: (provided: any) => ({
    ...provided,
    width: '100%', 
  }),
  control: (provided: any) => ({
    ...provided,
    borderRadius: '4px', 
    border: '1px solid #E4E4E7', 
    padding: '4px 7px', 
  }),
  input: (provided: any) => ({
    ...provided,
    fontSize: '14px', 
    color: '#333', 
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '4px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#000000' : 'transparent', 
    color: state.isSelected ? '#fff' : '#333', 
    '&:hover': {
      backgroundColor: '#f1f1f1', 
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9aa4ab', 
  }),
};

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
  const classes = useStyles(); // Initialize the styles
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

    let inputKeys = Object.keys(categoryMap).filter(
      (key) => key !== 'ref' || definitionsInSchema,
    );

    if (mods) inputKeys = subtractArray(inputKeys, mods.deactivatedFormInputs);

    return inputKeys
      .map((key) => ({ value: key, label: categoryMap[key] }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  return (
    <React.Fragment>
      <div className={classes.cardEntryRow}>
        {/* {showObjectNameInput && ( */}
        {/* <div className={classes.cardEntry}> */}
        {/* <h5 className={classes.label}>
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
                type="help"
              />
            </h5> */}

        {/* <FormGroup className={classes.formGroup}>
              <Input
                invalid={keyError !== null}
                value={keyState || ''}
                placeholder="Key"
                type="text"
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
                className={classnames(classes.inputField, {
                  [classes.invalidInput]: keyError,
                })}
              />
              <FormFeedback>{keyError}</FormFeedback>
            </FormGroup>
          </div>
        )} */}

        <div
          className={classnames(classes.cardEntry, {
            [classes.wideCardEntry]: !showObjectNameInput,
          })}
        >
          <h5 className={classes.label}>
            Question
          </h5>
          <Input
            value={titleState || ''}
            placeholder='Display name'
            type='text'
            onChange={(ev) => setTitleState(ev.target.value)}
            onBlur={(ev) => {
              onChange({ ...parameters, title: ev.target.value });
            }}
            className={classes.inputField}
          />
        </div>
        <div
          className={classnames(classes.cardEntry, {
            [classes.wideCardEntry]: !showObjectNameInput,
          })}
        >
          <h5 className={classes.label}>
            Answer type
          </h5>
          <Select
            value={{
              value: parameters.category,
              label: categoryMap[parameters.category!],
            }}
            placeholder={inputTypeLabel}
            options={availableInputTypes()}
            onChange={(val: any) => {
              const newCategory = val.value;

              const newProps = {
                ...defaultUiProps(newCategory, allFormInputs),
                ...defaultDataProps(newCategory, allFormInputs),
                name: parameters.name,
                required: parameters.required,
              };
              if (newProps.$ref !== undefined && !newProps.$ref) {
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
            styles={customSelectStyles}
          />
        </div>
      </div>

      <div className={classes.cardEntryRow}>
        {/* <div className={classnames(classes.cardEntry, { [classes.wideCardEntry]: !showObjectNameInput })}>
          <h5 className={classes.label}>
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
              type="help"
            />
          </h5>
          <FormGroup className={classes.formGroup}>
            <Input
              value={descriptionState || ''}
              placeholder="Description"
              type="text"
              onChange={(ev) => setDescriptionState(ev.target.value)}
              onBlur={(ev) => {
                onChange({ ...parameters, description: ev.target.value });
              }}
              className={classes.inputField}
            />
          </FormGroup>
        </div> */}
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
