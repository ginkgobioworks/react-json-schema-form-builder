// @flow

import React from 'react';

import JsonSchemaFormEditor from './JsonSchemaFormEditor';
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

export default function PlaygroundContainer({ title }: { title: string }) {
  const [schema, setSchema] = React.useState('{}');
  const [uischema, setUischema] = React.useState('{}');
  const classes = useStyles();
  return (
    <div className='service-playground'>
      <div className={classes.header}>
        <h1>{title}</h1>
        <p>
          Demo app for the{' '}
          <a href='https://github.com/ginkgobioworks/react-json-schema-form-builder'>
            React JSON Schema Form Editor
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
      <JsonSchemaFormEditor
        lang={'json'}
        schema={schema}
        uischema={uischema}
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
