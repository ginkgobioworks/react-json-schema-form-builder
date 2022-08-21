// @flow
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';
import { createUseStyles } from 'react-jss';
import {
  Alert,
  Input,
  UncontrolledTooltip,
  FormGroup,
  FormFeedback,
} from 'reactstrap';
import {
  faArrowUp,
  faArrowDown,
  faPencilAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
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
import FontAwesomeIcon from './FontAwesomeIcon';
import { getRandomId } from './utils';
import type { Node } from 'react';
import type { FormInput, Mods } from './types';

const useStyles = createUseStyles({
  sectionContainer: {
    '& .section-head': {
      display: 'flex',
      borderBottom: '1px solid gray',
      margin: '0.5em 1.5em 0 1.5em',
      '& h5': {
        color: 'black',
        fontSize: '14px',
        fontWeight: 'bold',
      },
      '& .section-entry': {
        width: '33%',
        textAlign: 'left',
        padding: '0.5em',
      },
      '& .section-reference': { width: '100%' },
    },
    '& .section-footer': {
      marginTop: '1em',
      textAlign: 'center',
      '& .fa': { cursor: 'pointer' },
    },
    '& .section-interactions': {
      margin: '0.5em 1.5em',
      textAlign: 'left',
      borderTop: '1px solid gray',
      paddingTop: '1em',
      '& .fa': {
        marginRight: '1em',
        borderRadius: '4px',
        padding: '0.25em',
        height: '25px',
        width: '25px',
      },
      '& .fa-pencil-alt, &.fa-pencil, & .fa-arrow-up, & .fa-arrow-down': {
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
}): Node {
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
  const [keyError, setKeyError] = React.useState(null);
  // keep requirements in state to avoid rapid updates
  const [modalOpen, setModalOpen] = React.useState(false);
  const [elementId] = React.useState(getRandomId());

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
                  id={`${elementId}_parentinfo`}
                  type='alert'
                />
              ) : (
                ''
              )}
            </span>
            <span className='arrows'>
              <span id={`${elementId}_moveupbiginfo`}>
                <FontAwesomeIcon
                  icon={faArrowUp}
                  onClick={() => (onMoveUp ? onMoveUp() : {})}
                />
              </span>
              <UncontrolledTooltip
                placement='top'
                target={`${elementId}_moveupbiginfo`}
              >
                Move form element up
              </UncontrolledTooltip>
              <span id={`${elementId}_movedownbiginfo`}>
                <FontAwesomeIcon
                  icon={faArrowDown}
                  onClick={() => (onMoveDown ? onMoveDown() : {})}
                />
              </span>
              <UncontrolledTooltip
                placement='top'
                target={`${elementId}_movedownbiginfo`}
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
            <div className='section-entry' data-test='section-object-name'>
              <h5>
                Section Object Name{' '}
                <Tooltip
                  text={
                    mods &&
                    mods.tooltipDescriptions &&
                    mods.tooltipDescriptions &&
                    typeof mods.tooltipDescriptions.cardSectionObjectName ===
                      'string'
                      ? mods.tooltipDescriptions.cardSectionObjectName
                      : 'The key to the object that will represent this form section.'
                  }
                  id={`${elementId}_nameinfo`}
                  type='help'
                />
              </h5>
              <FormGroup>
                <Input
                  invalid={keyError !== null}
                  value={keyName || ''}
                  placeholder='Key'
                  type='text'
                  onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
                    setKeyName(ev.target.value)
                  }
                  onBlur={(ev: SyntheticInputEvent<HTMLInputElement>) => {
                    const { value } = ev.target;
                    if (
                      value === name ||
                      !(neighborNames && neighborNames.includes(value))
                    ) {
                      setKeyError(null);
                      onNameChange(value);
                    } else {
                      setKeyName(name);
                      setKeyError(`"${value}" is already in use.`);
                      onNameChange(name);
                    }
                  }}
                  className='card-text'
                  readOnly={hideKey}
                />
                <FormFeedback>{keyError}</FormFeedback>
              </FormGroup>
            </div>
            <div className='section-entry' data-test='section-display-name'>
              <h5>
                Section Display Name{' '}
                <Tooltip
                  text={
                    mods &&
                    mods.tooltipDescriptions &&
                    mods.tooltipDescriptions &&
                    typeof mods.tooltipDescriptions.cardSectionDisplayName ===
                      'string'
                      ? mods.tooltipDescriptions.cardSectionDisplayName
                      : 'The name of the form section that will be shown to users of the form.'
                  }
                  id={`${elementId}_titleinfo`}
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
            <div className='section-entry' data-test='section-description'>
              <h5>
                Section Description{' '}
                <Tooltip
                  text={
                    mods &&
                    mods.tooltipDescriptions &&
                    mods.tooltipDescriptions &&
                    typeof mods.tooltipDescriptions.cardSectionDescription ===
                      'string'
                      ? mods.tooltipDescriptions.cardSectionDescription
                      : 'A description of the section which will be visible on the form.'
                  }
                  id={`${elementId}_descriptioninfo`}
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
                <li key={`${elementId}_${message}`}>{message}</li>
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
              tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
              addElem={(choice: string) => {
                if (choice === 'card') {
                  addCardObj({
                    schema,
                    uischema,
                    mods,
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
            <span id={`${elementId}_editinfo`}>
              <FontAwesomeIcon
                icon={faPencilAlt}
                onClick={() => setModalOpen(true)}
              />
            </span>
            <UncontrolledTooltip
              placement='top'
              target={`${elementId}_editinfo`}
            >
              Additional configurations for this form element
            </UncontrolledTooltip>
            <span id={`${elementId}_trashinfo`}>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => (onDelete ? onDelete() : {})}
              />
            </span>
            <UncontrolledTooltip
              placement='top'
              target={`${elementId}_trashinfo`}
            >
              Delete form element
            </UncontrolledTooltip>
            <FBCheckbox
              onChangeValue={() => onRequireToggle()}
              isChecked={required}
              label='Required'
              id={`${elementId}_required`}
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
            'ui:column': uischema['ui:column'] ?? '',
          }}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onChange={(newComponentProps: { [string]: any }) => {
            onDependentsChange(newComponentProps.dependents);
            onChange(schema, {
              ...uischema,
              'ui:column': newComponentProps['ui:column'],
            });
          }}
          TypeSpecificParameters={CardDefaultParameterInputs}
        />
      </Collapse>
      {addElem ? (
        <Add
          tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
          addElem={(choice: string) => addElem(choice)}
        />
      ) : (
        ''
      )}
    </React.Fragment>
  );
}
