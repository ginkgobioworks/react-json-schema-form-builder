// @flow
import * as React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';
import { createUseStyles } from 'react-jss';
import { Alert, Input, UncontrolledTooltip } from 'reactstrap';
import FBCheckbox from './checkbox/FBCheckbox';
import Collapse from './Collapse/Collapse';
import CardModal from './CardModal';
import { CardDefaultParameterInputs } from './defaults/defaultInputs';
import Tooltip from './Tooltip';
import Add from './Add';
import Card from './Card';
import {
  checkForUnsupportedFeatures,
  generateElementComponentsFromSchemas,
  countElementsFromSchema,
  addCardObj,
  addSectionObj,
  onDragEnd,
} from './utils';
import type { FormInput, Mods } from './types';

const useStyles = createUseStyles({
  sectionContainer: {
    '& .section-head': {
      borderBottom: '1px solid var(--gray)',
      margin: '0.5em 1.5em 0 1.5em',
      '& h5': {
        color: 'black',
        fontSize: '14px',
        fontWeight: 'bold',
        margin: '0',
      },
      '& .section-entry': {
        display: 'inline-block',
        margin: '0',
        width: '33%',
        textAlign: 'left',
        padding: '0.5em',
      },
      '& .section-reference': { width: '100%' },
    },
    '& .section-footer': {
      marginTop: '1em',
      textAlign: 'center',
      i: { cursor: 'pointer' },
    },
    '& .section-interactions': {
      margin: '0.5em 1.5em',
      textAlign: 'left',
      borderTop: '1px solid var(--gray)',
      paddingTop: '1em',
      '& .fa': { marginRight: '1em', borderRadius: '4px', padding: '0.25em' },
      '& .fa-pencil, & .fa-arrow-up, & .fa-arrow-down': {
        border: '1px solid #1d71ad',
        color: '#1d71ad',
      },
      '& .fa-trash': { border: '1px solid #de5354', color: '#de5354' },
      '& .fa-arrow-up, & .fa-arrow-down': { marginRight: '0.5em' },
      '& .fb-checkbox': {
        display: 'inline-block',
        label: { color: '#9aa4ab' },
      },
      '& .interactions-left, & .interactions-right': {
        display: 'inline-block',
        width: '48%',
        margin: '0 auto',
      },
      '& .interactions-left': { textAlign: 'left' },
      '& .interactions-right': { textAlign: 'right' },
    },
  },
});

export default function Section({
  name,
  required,
  schema,
  uischema,
  onChange,
  onNameChange,
  onRequireToggle,
  onDependentsChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  path,
  definitionData,
  definitionUi,
  hideKey,
  reference,
  dependents,
  dependent,
  parent,
  neighborNames,
  addElem,
  cardOpen,
  setCardOpen,
  allFormInputs,
  mods,
  categoryHash,
}: {
  name: string,
  required: boolean,
  schema: { [string]: any },
  uischema: { [string]: any },
  onChange: (
    schema: { [string]: any },
    uischema: { [string]: any },
    ref?: string,
  ) => void,
  onNameChange: (string) => void,
  onDependentsChange: (
    Array<{
      children: Array<string>,
      value?: any,
    }>,
  ) => void,
  onRequireToggle: () => any,
  onDelete: () => any,
  onMoveUp?: () => any,
  onMoveDown?: () => any,
  path: string,
  definitionData: { [string]: any },
  definitionUi: { [string]: any },
  hideKey?: boolean,
  reference?: string,
  dependents?: Array<{
    children: Array<string>,
    value?: any,
  }>,
  dependent?: boolean,
  parent?: string,
  neighborNames?: Array<string>,
  addElem?: (choice: string) => void,
  cardOpen: boolean,
  setCardOpen: (newState: boolean) => void,
  allFormInputs: { [string]: FormInput },
  mods?: Mods,
  categoryHash: { [string]: string },
}) {
  const classes = useStyles();
  const unsupportedFeatures = checkForUnsupportedFeatures(
    schema || {},
    uischema || {},
    allFormInputs,
  );
  const schemaData = schema || {};
  const elementNum = countElementsFromSchema(schemaData);
  const defaultCollapseStates = [...Array(elementNum)].map(() => false);
  const [cardOpenArray, setCardOpenArray] = React.useState(
    defaultCollapseStates,
  );
  // keep name in state to avoid losing focus
  const [keyName, setKeyName] = React.useState(name);
  // keep requirements in state to avoid rapid updates
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Collapse
        isOpen={cardOpen}
        toggleCollapse={() => setCardOpen(!cardOpen)}
        title={
          <React.Fragment>
            <span onClick={() => setCardOpen(!cardOpen)} className='label'>
              {schemaData.title || keyName}{' '}
              {parent ? (
                <Tooltip
                  text={`Depends on ${parent}`}
                  id={`${keyName}_parentinfo`}
                  type='alert'
                />
              ) : (
                ''
              )}
            </span>
            <span className='arrows'>
              <i
                className='fa fa-arrow-up'
                id={`${path}_moveupbiginfo`}
                onClick={() => (onMoveUp ? onMoveUp() : {})}
              />
              <UncontrolledTooltip
                placement='top'
                target={`${path}_moveupbiginfo`}
              >
                Move form element up
              </UncontrolledTooltip>
              <i
                className='fa fa-arrow-down'
                id={`${path}_movedownbiginfo`}
                onClick={() => (onMoveDown ? onMoveDown() : {})}
              />
              <UncontrolledTooltip
                placement='top'
                target={`${path}_movedownbiginfo`}
              >
                Move form element down
              </UncontrolledTooltip>
            </span>
          </React.Fragment>
        }
        className={`section-container ${classes.sectionContainer} ${
          dependent ? 'section-dependent' : ''
        } ${reference ? 'section-reference' : ''}`}
      >
        <div
          className={`section-entries ${reference ? 'section-reference' : ''}`}
        >
          <div className='section-head'>
            {reference ? (
              <div className='section-entry section-reference'>
                <h5>Reference Section</h5>
                <Select
                  value={{
                    value: reference,
                    label: reference,
                  }}
                  placeholder='Reference'
                  options={Object.keys(definitionData).map((key) => ({
                    value: `#/definitions/${key}`,
                    label: `#/definitions/${key}`,
                  }))}
                  onChange={(val: any) => {
                    onChange(schema, uischema, val.value);
                  }}
                  className='section-select'
                />
              </div>
            ) : (
              ''
            )}
            <div className='section-entry'>
              <h5>
                Section Object Name{' '}
                <Tooltip
                  text='The key to the object that will represent this form section.'
                  id={`${keyName}_nameinfo`}
                  type='help'
                />
              </h5>
              <Input
                value={keyName || ''}
                placeholder='Key'
                type='text'
                onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
                  setKeyName(ev.target.value.replace(/\W/g, '_'))
                }
                onBlur={(ev: SyntheticInputEvent<HTMLInputElement>) =>
                  onNameChange(ev.target.value)
                }
                className='card-text'
                readOnly={hideKey}
              />
            </div>
            <div className='section-entry'>
              <h5>
                Section Display Name{' '}
                <Tooltip
                  text='The name of the form section that will be shown to users of the form.'
                  id={`${keyName}_titleinfo`}
                  type='help'
                />
              </h5>
              <Input
                value={schemaData.title || ''}
                placeholder='Title'
                type='text'
                onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
                  onChange(
                    {
                      ...schema,
                      title: ev.target.value,
                    },
                    uischema,
                  )
                }
                className='card-text'
              />
            </div>
            <div className='section-entry'>
              <h5>
                Section Description{' '}
                <Tooltip
                  text='This will appear as gray text in the service request form'
                  id={`${keyName}_descriptioninfo`}
                  type='help'
                />
              </h5>
              <Input
                value={schemaData.description || ''}
                placeholder='Description'
                type='text'
                onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
                  onChange(
                    {
                      ...schema,
                      description: ev.target.value,
                    },
                    uischema,
                  )
                }
                className='card-text'
              />
            </div>
            <Alert
              style={{
                display: unsupportedFeatures.length === 0 ? 'none' : 'block',
              }}
              color='warning'
            >
              <h5>Unsupported Features:</h5>
              {unsupportedFeatures.map((message) => (
                <li key={`${path}_${message}`}>{message}</li>
              ))}
            </Alert>
          </div>
          <div className='section-body'>
            <DragDropContext
              onDragEnd={(result) =>
                onDragEnd(result, {
                  schema,
                  uischema,
                  onChange,
                  definitionData,
                  definitionUi,
                  categoryHash,
                })
              }
              className='section-body'
            >
              <Droppable droppableId='droppable'>
                {(providedDroppable) => (
                  <div
                    ref={providedDroppable.innerRef}
                    {...providedDroppable.droppableProps}
                  >
                    {generateElementComponentsFromSchemas({
                      schemaData: schema,
                      uiSchemaData: uischema,
                      onChange,
                      path,
                      definitionData,
                      definitionUi,
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
          <div className='section-footer'>
            <Add
              name={`${keyName}_inner`}
              addElem={(choice: string) => {
                if (choice === 'card') {
                  addCardObj({
                    schema,
                    uischema,
                    onChange,
                    definitionData,
                    definitionUi,
                    categoryHash,
                  });
                } else if (choice === 'section') {
                  addSectionObj({
                    schema,
                    uischema,
                    onChange,
                    definitionData,
                    definitionUi,
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
          <div className='section-interactions'>
            <i
              className='fa fa-pencil'
              id={`${path}_editinfo`}
              onClick={() => setModalOpen(true)}
            />
            <UncontrolledTooltip placement='top' target={`${path}_editinfo`}>
              Additional configurations for this form element
            </UncontrolledTooltip>
            <i
              className='fa fa-trash'
              id={`${path}_trashinfo`}
              onClick={() => (onDelete ? onDelete() : {})}
            />
            <UncontrolledTooltip placement='top' target={`${path}_trashinfo`}>
              Delete form element
            </UncontrolledTooltip>
            <FBCheckbox
              onChangeValue={() => onRequireToggle()}
              isChecked={required}
              label='Required'
              id={`${path}_required`}
            />
          </div>
        </div>
        <CardModal
          componentProps={{
            dependents,
            neighborNames,
            name: keyName,
            schema,
            type: 'object',
          }}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onChange={(newComponentProps: { [string]: any }) => {
            onDependentsChange(newComponentProps.dependents);
          }}
          TypeSpecificParameters={CardDefaultParameterInputs}
        />
      </Collapse>
      {addElem ? (
        <Add name={keyName} addElem={(choice: string) => addElem(choice)} />
      ) : (
        ''
      )}
    </React.Fragment>
  );
}
