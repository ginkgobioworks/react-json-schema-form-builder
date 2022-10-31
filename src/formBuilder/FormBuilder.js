// @flow
import * as React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Alert, Input } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import Card from './Card';
import Section from './Section';
import Add from './Add';
import { arrows as arrowsStyle } from './styles';
import {
  parse,
  stringify,
  checkForUnsupportedFeatures,
  generateElementComponentsFromSchemas,
  addCardObj,
  addSectionObj,
  onDragEnd,
  countElementsFromSchema,
  generateCategoryHash,
  excludeKeys,
} from './utils';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import type { Node } from 'react';
import type { Mods } from './types';

const useStyles = createUseStyles({
  formBuilder: {
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
    '& .fa-plus-square, & .fa-square-plus': {
      color: 'green',
      'font-size': '1.5em',
      margin: '0 auto',
    },
    ...arrowsStyle,
    '& .card-container': {
      '&:hover': {
        border: '1px solid green',
      },
      display: 'block',
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
        color: '#000',
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
    '& .card-container:hover': { border: '1px solid green' },
    '& .card-dependent': {
      border: '1px dashed gray',
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
    '& .section-container:hover': { border: '1px solid green' },
    '& .section-dependent': {
      border: '1px dashed gray',
    },
    '& .section-requirements': {
      border: '1px dashed black',
    },
    '& .alert': {
      textAlign: 'left',
      width: '70%',
      margin: '1em auto',
      '& h5': {
        color: 'black',
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '0',
      },
      '& .fa': { fontSize: '14px' },
    },
    '& .disabled-unchecked-checkbox': {
      color: 'gray',
      '& div::before': { backgroundColor: 'lightGray' },
    },
    '& .disabled-input': {
      '& input': { backgroundColor: 'lightGray' },
      '& input:focus': {
        backgroundColor: 'lightGray',
        border: '1px solid gray',
      },
    },
  },
  formHead: {
    display: 'block',
    margin: '0 auto',
    'background-color': '#01689b',
    border: '1px solid #858F96',
    'border-radius': '4px',
    width: '70%',
    padding: '10px',
    '& div': {
      width: '30%',
      display: 'inline-block',
      'text-align': 'left',
      padding: '10px',
    },
    '& .form-title': {
      'text-align': 'left',
    },
    '& .form-description': {
      'text-align': 'left',
    },
    '& h5': {
      'font-size': '14px',
      'line-height': '21px',
      'font-weight': 'bold',
      color: '#FFFFFF',
    },
  },
  formBody: {
    display: 'flex',
    flexDirection: 'column',
    '& .fa-pencil-alt, & .fa-pencil': {
      border: '1px solid #1d71ad',
      color: '#1d71ad',
    },
    '& .modal-body': {
      maxHeight: '500px',
      overflowY: 'scroll',
    },
    '& .card-add': {
      cursor: 'pointer',
      display: 'block',
      color: '$green',
      fontSize: '1.5em',
    },
  },
  formFooter: {
    marginTop: '1em',
    textAlign: 'center',
    '& .fa': { cursor: 'pointer', color: '$green', fontSize: '1.5em' },
  },
});

export default function FormBuilder({
  schema,
  uischema,
  onChange,
  mods,
  className,
}: {
  schema: string,
  uischema: string,
  onChange: (string, string) => any,
  mods?: Mods,
  className?: string,
}): Node {
  const classes = useStyles();
  const schemaData = (parse(schema): { [string]: any }) || {};
  schemaData.type = 'object';
  const uiSchemaData = (parse(uischema): { [string]: any }) || {};
  const allFormInputs = excludeKeys(
    Object.assign(
      {},
      DEFAULT_FORM_INPUTS,
      (mods && mods.customFormInputs) || {},
    ),
    mods && mods.deactivatedFormInputs,
  );

  const unsupportedFeatures = checkForUnsupportedFeatures(
    schemaData,
    uiSchemaData,
    allFormInputs,
  );

  const elementNum = countElementsFromSchema(schemaData);
  const defaultCollapseStates = [...Array(elementNum)].map(() => false);
  const [cardOpenArray, setCardOpenArray] = React.useState(
    defaultCollapseStates,
  );
  const categoryHash = generateCategoryHash(allFormInputs);

  return (
    <div className={`${classes.formBuilder} ${className || ''}`}>
      <Alert
        style={{
          display: unsupportedFeatures.length === 0 ? 'none' : 'block',
        }}
        color='warning'
      >
        <h5>Unsupported Features:</h5>
        {unsupportedFeatures.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </Alert>
      {(!mods || mods.showFormHead !== false) && (
        <div className={classes.formHead} data-test='form-head'>
          <div>
            <h5 data-test='form-name-label'>
              {mods &&
              mods.labels &&
              typeof mods.labels.formNameLabel === 'string'
                ? mods.labels.formNameLabel
                : 'Form Name'}
            </h5>
            <Input
              value={schemaData.title || ''}
              placeholder='Title'
              type='text'
              onChange={(ev: SyntheticInputEvent<HTMLInputElement>) => {
                onChange(
                  stringify({
                    ...schemaData,
                    title: ev.target.value,
                  }),
                  uischema,
                );
              }}
              className='form-title'
            />
          </div>
          <div>
            <h5 data-test='form-description-label'>
              {mods &&
              mods.labels &&
              typeof mods.labels.formDescriptionLabel === 'string'
                ? mods.labels.formDescriptionLabel
                : 'Form Description'}
            </h5>
            <Input
              value={schemaData.description || ''}
              placeholder='Description'
              type='text'
              onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
                onChange(
                  stringify({
                    ...schemaData,
                    description: ev.target.value,
                  }),
                  uischema,
                )
              }
              className='form-description'
            />
          </div>
        </div>
      )}
      <div className={`form-body ${classes.formBody}`}>
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(result, {
              schema: schemaData,
              uischema: uiSchemaData,
              onChange: (newSchema, newUiSchema) =>
                onChange(stringify(newSchema), stringify(newUiSchema)),
              definitionData: schemaData.definitions,
              definitionUi: uiSchemaData.definitions,
              categoryHash,
            })
          }
          className='form-body'
        >
          <Droppable droppableId='droppable'>
            {(providedDroppable) => (
              <div
                ref={providedDroppable.innerRef}
                {...providedDroppable.droppableProps}
              >
                {generateElementComponentsFromSchemas({
                  schemaData,
                  uiSchemaData,
                  onChange: (newSchema, newUiSchema) =>
                    onChange(stringify(newSchema), stringify(newUiSchema)),
                  definitionData: schemaData.definitions,
                  definitionUi: uiSchemaData.definitions,
                  path: 'root',
                  cardOpenArray,
                  setCardOpenArray,
                  allFormInputs,
                  mods,
                  categoryHash,
                  Card,
                  Section,
                }).map((element: any, index) => (
                  <Draggable
                    key={element.key}
                    draggableId={element.key}
                    index={index}
                  >
                    {(providedDraggable) => (
                      <div
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                      >
                        {element}
                      </div>
                    )}
                  </Draggable>
                ))}
                {providedDroppable.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className={`form-footer ${classes.formFooter}`}>
        <Add
          tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
          addElem={(choice: string) => {
            if (choice === 'card') {
              addCardObj({
                schema: schemaData,
                uischema: uiSchemaData,
                mods: mods,
                onChange: (newSchema, newUiSchema) =>
                  onChange(stringify(newSchema), stringify(newUiSchema)),
                definitionData: schemaData.definitions,
                definitionUi: uiSchemaData.definitions,
                categoryHash,
              });
            } else if (choice === 'section') {
              addSectionObj({
                schema: schemaData,
                uischema: uiSchemaData,
                onChange: (newSchema, newUiSchema) =>
                  onChange(stringify(newSchema), stringify(newUiSchema)),
                definitionData: schemaData.definitions,
                definitionUi: uiSchemaData.definitions,
                categoryHash,
              });
            }
          }}
          hidden={
            schemaData.properties &&
            Object.keys(schemaData.properties).length !== 0
          }
        />
      </div>
    </div>
  );
}
