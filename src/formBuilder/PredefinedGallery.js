// @flow
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import CardGallery from './CardGallery';
import {
  parse,
  stringify,
  propagateDefinitionChanges,
  generateCategoryHash,
  excludeKeys,
} from './utils';
import { arrows as arrowsStyle } from './styles';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import type { Node } from 'react';
import type { Mods } from './types';

const useStyles = createUseStyles({
  preDefinedGallery: {
    display: 'flex',
    flexDirection: 'column',
    'text-align': 'center',
    '& .fa': {
      cursor: 'pointer',
    },
    '& .fa-question-circle, & .fa-circle-question': {
      color: 'gray',
    },
    '& .fa-asterisk': {
      'font-size': '.9em',
      color: 'green',
    },
    ...arrowsStyle,
    '& .form_footer': {
      marginTop: '1em',
      textAlign: 'center',
      '& .fa': { cursor: 'pointer', color: '$green', fontSize: '1.5em' },
    },
    '& .fa-plus-square & .fa-square-plus': {
      color: 'green',
      'font-size': '1.5em',
      margin: '0 auto',
    },
    '& .card-container': {
      '&:hover': {
        border: '1px solid green',
      },
      width: '70%',
      'min-width': '400px',
      margin: '2em auto',
      border: '1px solid gray',
      'border-radius': '4px',
      'background-color': 'white',
      '& h4': {
        width: '100%',
        'text-align': 'left',
        display: 'inline-block',
        color: '#138AC2',
        margin: '0.25em .5em 0 .5em',
        'font-size': '18px',
      },
      '& .d-flex': {
        'border-bottom': '1px solid gray',
      },
      '& .label': {
        float: 'left',
      },
    },
    '& .card-requirements': {
      border: '1px dashed black',
    },
    '& .section-container': {
      '&:hover': {
        border: '1px solid green',
      },
      display: 'block',
      width: '90%',
      'min-width': '400px',
      margin: '2em auto',
      border: '1px solid gray',
      'border-radius': '4px',
      'background-color': 'white',
      '& h4': {
        width: '100%',
        'text-align': 'left',
        display: 'inline-block',
        color: '#138AC2',
        margin: '0.25em .5em 0 .5em',
        'font-size': '18px',
      },
      '& .d-flex': {
        'border-bottom': '1px solid gray',
      },
      '& .label': {
        float: 'left',
      },
    },
    '& .section-dependent': {
      border: '1px dashed gray',
    },
    '& .section-requirements': {
      border: '1px dashed black',
    },
    '& .fa-pencil-alt, & .fa-pencil': {
      border: '1px solid #1d71ad',
      color: '#1d71ad',
    },
    '& .modal-body': {
      maxHeight: '500px',
      overflowY: 'scroll',
    },
    '& .card-container:hover': { border: '1px solid green' },
    '& .card-dependent': { border: '1px dashed gray' },
    '& .card-add': {
      cursor: 'pointer',
      display: 'block',
      color: '$green',
      fontSize: '1.5em',
    },

    '& .section-container:hover': { border: '1px solid green' },
  },
});

export default function PredefinedGallery({
  schema,
  uischema,
  onChange,
  mods,
}: {
  schema: string,
  uischema: string,
  onChange: (string, string) => any,
  mods?: Mods,
}): Node {
  const classes = useStyles();
  const schemaData = React.useMemo(
    () => (parse(schema): { [string]: any }) || {},
    [schema],
  );
  const uiSchemaData = React.useMemo(
    () => (parse(uischema): { [string]: any }) || {},
    [uischema],
  );
  const allFormInputs = excludeKeys(
    Object.assign(
      {},
      DEFAULT_FORM_INPUTS,
      (mods && mods.customFormInputs) || {},
    ),
    mods && mods.deactivatedFormInputs,
  );
  const categoryHash = generateCategoryHash(allFormInputs);

  React.useEffect(() => {
    if (!uiSchemaData.definitions) {
      // eslint-disable-next-line no-console
      console.log('Parsing UI schema to assign UI for definitions');
      // need to create definitions from scratch
      const references = [];
      // recursively search for all $refs in the schemaData
      const findRefs = (name, schemaObject) => {
        if (!schemaObject) return;
        if (typeof schemaObject === 'object')
          Object.keys(schemaObject).forEach((key) => {
            if (typeof key === 'string') {
              if (key === '$ref') references.push(name);
              findRefs(key, schemaObject[key]);
            }
          });
        if (Array.isArray(schemaObject))
          schemaObject.forEach((innerObj) => {
            findRefs(name, innerObj);
          });
      };

      findRefs('root', schemaData);

      uiSchemaData.definitions = {};
      const referenceSet = new Set(references);
      Object.keys(uiSchemaData).forEach((uiProp) => {
        if (referenceSet.has(uiProp))
          uiSchemaData.definitions[uiProp] = uiSchemaData[uiProp];
      });
      if (!Object.keys(uiSchemaData.definitions).length) {
        uiSchemaData.definitions = undefined;
      }
      onChange(stringify(schemaData), stringify(uiSchemaData));
    }
  }, [uiSchemaData, schemaData, onChange]);
  return (
    <div className={classes.preDefinedGallery}>
      <CardGallery
        definitionSchema={schemaData.definitions || {}}
        definitionUiSchema={uiSchemaData.definitions || {}}
        onChange={(
          newDefinitions: { [string]: any },
          newDefinitionsUi: { [string]: any },
        ) => {
          // propagate changes in ui definitions to all relavant parties in main schema

          propagateDefinitionChanges(
            { ...schemaData, definitions: newDefinitions },
            { ...uiSchemaData, definitions: newDefinitionsUi },
            (newSchema, newUiSchema) =>
              onChange(stringify(newSchema), stringify(newUiSchema)),
            categoryHash,
          );
        }}
        mods={mods}
        categoryHash={categoryHash}
      />
    </div>
  );
}
