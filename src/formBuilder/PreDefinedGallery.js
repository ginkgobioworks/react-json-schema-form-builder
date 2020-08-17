// @flow
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import CardGallery from './CardGallery';
import {
  parse,
  stringify,
  propagateDefinitionChanges,
  generateCategoryHash,
} from './utils';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import type { Mods } from './types';

const useStyles = createUseStyles({
  preDefinedGallery: {
    display: 'flex',
    'flex-direction': 'column',
    'text-align': 'center',
    '& i': {
      cursor: 'pointer',
    },
    '& .fa-question-circle': {
      color: 'gray',
    },
    '& .fa-asterisk': {
      'font-size': '.9em',
      color: 'green',
    },
    '& .form_footer': {
      marginTop: '1em',
      textAlign: 'center',
      '& i': { cursor: 'pointer', color: '$green', fontSize: '1.5em' },
    },
    '& .fa-plus-square': {
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
      '& .toggle-collapse': {
        margin: '0.25em .5em 0 .5em !important',
      },
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
      '& .arrows': {
        'text-align': 'right',
        float: 'right',
        '& .fa-trash': {
          border: '1px solid #DE5354',
          color: '#DE5354',
        },
        '& .fa': {
          'border-radius': '4px',
          padding: '.25em',
          margin: '0 .5em 0 0',
        },
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
      border: '1px solid var(--gray)',
      'border-radius': '4px',
      'background-color': 'white',
      '& .toggle-collapse': {
        margin: '0.25em .5em 0 .5em !important',
      },
      '& h4': {
        width: '100%',
        'text-align': 'left',
        display: 'inline-block',
        color: '#138AC2',
        margin: '0.25em .5em 0 .5em',
        'font-size': '18px',
      },
      '& .d-flex': {
        'border-bottom': '1px solid var(--gray)',
      },
      '& .label': {
        float: 'left',
      },
      '& .arrows': {
        'text-align': 'right',
        float: 'right',
        '& .fa-trash': {
          border: '1px solid #DE5354',
          color: '#DE5354',
        },
        '& .fa': {
          'border-radius': '4px',
          padding: '.25em',
          margin: '0 .5em 0 0',
        },
      },
    },
    '& .section-dependent': {
      border: '1px dashed gray',
    },
    '& .section-requirements': {
      border: '1px dashed black',
    },
    '& .fa-pencil, & .fa-arrow-up, & .fa-arrow-down': {
      border: '1px solid #1d71ad',
      color: '#1d71ad',
    },
    '& .modal-body': {
      maxHeight: '500px',
      overflowY: 'scroll',
    },
    '& .card-container:hover': { border: '1px solid var(--green)' },
    '& .card-dependent': { border: '1px dashed var(--gray)' },
    '& .card-add': {
      cursor: 'pointer',
      display: 'block',
      color: '$green',
      fontSize: '1.5em',
    },

    '& .section-container:hover': { border: '1px solid var(--green)' },
  },
});

export default function PreDefinedGallery({
  schema,
  uischema,
  onChange,
  lang,
  mods,
}: {
  schema: string,
  uischema: string,
  onChange: (string, string) => any,
  lang: string,
  mods?: Mods,
}) {
  const classes = useStyles();
  const schemaData = (parse(schema, lang): { [string]: any }) || {};
  const uiSchemaData = (parse(uischema, lang): { [string]: any }) || {};
  const allFormInputs = {
    ...DEFAULT_FORM_INPUTS,
    ...(mods && mods.customFormInputs),
  };
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

      onChange(stringify(schemaData, lang), stringify(uiSchemaData, lang));
    }
  }, [uischema, schema]);
  return (
    <div className={classes.preDefinedGallery}>
      <CardGallery
        definitionSchema={schemaData.definitions}
        definitionUiSchema={uiSchemaData.definitions}
        language={lang}
        onChange={(
          newDefinitions: { [string]: any },
          newDefinitionsUi: { [string]: any }
        ) => {
          schemaData.definitions = newDefinitions;
          uiSchemaData.definitions = newDefinitionsUi;
          // propagate changes in ui definitions to all relavant parties in main schema

          propagateDefinitionChanges(
            schemaData,
            uiSchemaData,
            (newSchema, newUiSchema) =>
              onChange(
                stringify(newSchema, lang),
                stringify(newUiSchema, lang)
              ),
            categoryHash
          );
        }}
        mods={mods}
        categoryHash={categoryHash}
      />
    </div>
  );
}
