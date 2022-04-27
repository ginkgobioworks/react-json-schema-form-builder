// @flow

import React from 'react';

import JsonSchemaFormSuite from './JsonSchemaFormSuite';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  header: {
    '& h1': {
      textAlign: 'center',
      margin: '1em',
    },
    '& p': {
      marginRight: '5em',
      marginLeft: '5em',
    },
  },
});

// Can be used to set initial schemas and mods (useful for development)
const initialJsonSchema = {};
const initialUiSchema = {};
const mods = {tooltipDescriptions: {
  add: "test string",
  moveElementUpButtonTooltip: "test string",
  moveElementDownButtonTooltip: "test string",
  additionalConfTooltip: "test string",
  deleteFormElTooltip: "test string",
  cardObjectName: "test string",
  cardDisplayName: "test string",
  cardDescription: "test string",
  cardInputType: "test string",
  cardSectionObjectName: "test string",
  cardSectionDisplayName: "test string",
  cardSectionDescription: "test string",
},
labels: {
  formNameLabel: "test string",
  formDescriptionLabel: "test string",
  formNamePlaceholder: "test string",
  formDescriptionPlaceholder: "test string",
  addPopoverHeaderLabel: "test string",
  addPopoverFormElementLabel: "test string",
  addPopoverFormSectionLabel: "test string",
  addPopoverCancelButtonLabel: "test string",
  addPopoverCreateButtonLabel: "test string",
  cgpiKeyPlaceholder: "test string",
  cgpiTitlePlaceholder: "test string",
  cgpiDescPlaceholder: "test string",
  settingsModalHeaderLabel: "test string",
  requiredChkbxLabel: "test string",
  objectNameLabel: "test string",
  displayNameLabel: "test string",
  descriptionLabel: "test string",
  inputTypeLabel: "test string",
  sectionObjectNameLabel: "test string",
  sectionDisplayNameLabel: "test string",
  sectionDescriptionLabel: "test string",
  inputDefaultValueLabel:"test string",
  inputDefaultValuePlaceholder: "test string",
  inputDefaultPasswordLabel: "test string",
  inputDefaultPasswordPlaceholder: "test string",
  inputDefaultNumberLabel:"test string",
  inputDefaultNumberPlaceholder: "test string",
  inputDefaultCheckboxLabel:"test string",
  dropdownPossibleValuesLabel:"test string",
  dropdownPossibleValuesDescriptionLabel:"test string",
  dropdownForceNumberDescriptionLabel:"test string",
  dropdownInputPlaceholder:"test string",
  dropdownInputEnumPlaceholder:"test string",
  newElementDefaultSectionLable:"test SECTION",
  newElementDefaultInputLabel:"test INPUT"
}
};

export default function PlaygroundContainer({ title }: { title: string }) {
  const [schema, setSchema] = React.useState(JSON.stringify(initialJsonSchema));
  const [uischema, setUischema] = React.useState(
    JSON.stringify(initialUiSchema),
  );
  const classes = useStyles();
  return (
    <div className='playground'>
      <div className={classes.header}>
        <h1>{title}</h1>
        <p>
          Demo app for the{' '}
          <a href='https://github.com/ginkgobioworks/react-json-schema-form-builder'>
            React JSON Schema Form Builder
          </a>
          , which allows a user to visually build a form and obtain the JSON
          Schema corresponding to it
        </p>
        <p>
          The Visual Form Builder tab corresponds to the actual Form Builder
          component. This reads in code from the JSON Schema, which is stored
          and updated live in the "Edit Schema" tab, and renders the code as
          manipulatable form elements. The result of the form is rendered with
          the material design theme in the Preview Form tab. The Pre-Configured
          Components tab also demonstrates how the form builder takes advantage
          of the definitions property of JSON Schema to render definitions.
        </p>
      </div>
      <JsonSchemaFormSuite
        lang={'json'}
        schema={schema}
        uischema={uischema}
        mods={mods}
        schemaTitle='Data Schema'
        uischemaTitle='UI Schema'
        onChange={(newSchema: string, newUiSchema: string) => {
          setSchema(newSchema);
          setUischema(newUiSchema);
        }}
        width='95%'
        height='800px'
      />
    </div>
  );
}
