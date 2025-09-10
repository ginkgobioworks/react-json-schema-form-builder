import React, { ReactElement } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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
  faPencilAlt,
  faTrash,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import FBCheckbox from './checkbox/FBCheckbox';
import Collapse from './Collapse/Collapse';
import CardModal from './CardModal';
import { CardDefaultParameterInputs } from './defaults/defaultInputs';
import Tooltip from './Tooltip';
import Add from './Add';
import Card, { DeleteIcon, EditIcon } from './Card';
import {
  checkForUnsupportedFeatures,
  generateElementComponentsFromSchemas,
  countElementsFromSchema,
  addCardObj,
  addSectionObj,
  onDragEnd,
  DROPPABLE_TYPE,
} from './utils';
import FontAwesomeIcon from './FontAwesomeIcon';
import { getRandomId } from './utils';
import type { SectionPropsType } from './types';
import { FormControlLabel, Switch } from '@mui/material';

const useStyles = createUseStyles({
  inputContainer: {
    display: 'flex',
    justifyContent: 'stretch',
    gap: '20px',
    alignItems: 'center',
    width: '100%',
  },
  sectionContainer: {
    '& .section-head': {
      display: 'flex',
      borderBottom: '1px solid #E4E4E7',
      margin: '0.5em 1.5em 0 1.5em',
      '& h5': {
        color: 'black',
        fontSize: '14px',
        fontWeight: 'bold',
      },
      '& .section-entry': {
        width: '100%',
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '15px',
      margin: '0.5em 1.5em',
      textAlign: 'right',
      borderTop: '1px solid #e4e4e7',
      paddingTop: '1em',
      paddingBottom: '0.5em',
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
  parentProperties,
  neighborNames,
  cardOpen,
  setCardOpen,
  allFormInputs,
  mods,
  categoryHash,
}: SectionPropsType): ReactElement {
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
  const [keyError, setKeyError] = React.useState<null | string>(null);
  // keep requirements in state to avoid rapid updates
  const [modalOpen, setModalOpen] = React.useState(false);
  const [elementId] = React.useState(getRandomId());
  const [titleState, setTitleState] = React.useState('');
  const addProperties = {
    schema,
    uischema,
    mods,
    onChange,
    definitionData,
    definitionUi,
    categoryHash,
  };
  const hideAddButton =
    schemaData.properties && Object.keys(schemaData.properties).length !== 0;

  const [titleError, setTitleError] = React.useState<string | null>(null);
  const [descError, setDescError] = React.useState<string | null>(null);

  const validateSectionTitle = (value: string): string | null => {
    if (!value || value.trim().length < 3) {
      return 'Section name must be at least 3 characters long.';
    }
    return null;
  };

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
              {/* <span id={`${elementId}_moveupbiginfo`}>
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
              </UncontrolledTooltip> */}
              <span id={`${elementId}_movedownbiginfo`}>
                <FontAwesomeIcon
                  icon={cardOpen ? faChevronUp : faChevronDown }
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
            {/* <div className='section-entry' data-test='section-object-name'> */}
            {/* <h5>
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
              </h5> */}
            {/* <FormGroup>
                <Input
                  invalid={keyError !== null}
                  value={keyName || ''}
                  placeholder='Key'
                  type='text'
                  onChange={(ev) => setKeyName(ev.target.value)}
                  onBlur={(ev) => {
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
              </FormGroup> */}
            {/* </div> */}
            <div className={classes.inputContainer}>
              <div className='section-entry' data-test='section-display-name'>
                <h5>Section Display Name </h5>
                <Input
                  value={schemaData.title || titleState}
                  placeholder='Title'
                  type='text'
                  onChange={(ev) => {
                    const value = ev.target.value;
                    setTitleState(value);
                    setTitleError(validateSectionTitle(value));
                    onChange({ ...schema, title: value }, uischema);
                  }}
                  onBlur={(ev) => {
                    setTitleError(validateSectionTitle(ev.target.value));
                  }}
                  invalid={!!titleError}
                  className='card-text'
                />
                {titleError && <FormFeedback>{titleError}</FormFeedback>}
              </div>

              <div className='section-entry' data-test='section-description'>
                <h5>Section Description </h5>
                <Input
                  value={schemaData.description || ''}
                  placeholder='Description'
                  type='text'
                  onChange={(ev) => {
                    const value = ev.target.value;
                    onChange({ ...schema, description: value }, uischema);
                  }}
                  onBlur={(ev) => {
                  }}
                  invalid={!!descError}
                  className='card-text'
                />
              </div>
            </div>
            {/* <Alert
              style={{
                display: unsupportedFeatures.length === 0 ? 'none' : 'block',
              }}
              color='warning'
            >
              <h5>Unsupported Features:</h5>
              {unsupportedFeatures.map((message) => (
                <li key={`${elementId}_${message}`}>{message}</li>
              ))}
            </Alert> */}
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
            >
              <Droppable droppableId='droppable' type={DROPPABLE_TYPE}>
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
            {!hideAddButton &&
              mods?.components?.add &&
              mods.components.add(addProperties)}
            {!mods?.components?.add && (
              <Add
                tooltipDescription={
                  ((mods || {}).tooltipDescriptions || {}).add
                }
                addElem={(choice: string) => {
                  if (choice === 'card') {
                    addCardObj(addProperties);
                  } else if (choice === 'section') {
                    addSectionObj(addProperties);
                  }
                }}
                hidden={hideAddButton}
              />
            )}
          </div>
          <div className='section-interactions'>
            <div
              id={`${elementId}_editinfo`}
              onClick={() => setModalOpen(true)}
            >
              <EditIcon />
            </div>
            <UncontrolledTooltip
              placement='top'
              target={`${elementId}_editinfo`}
            >
              Additional configurations for this form element
            </UncontrolledTooltip>
            <div
              id={`${elementId}_trashinfo`}
              onClick={() => (onDelete ? onDelete() : {})}
            >
              <DeleteIcon />
            </div>
            <UncontrolledTooltip
              placement='top'
              target={`${elementId}_trashinfo`}
            >
              Delete form element
            </UncontrolledTooltip>
            <FormControlLabel
              control={
                <Switch
                  checked={required}
                  onChange={() => onRequireToggle()}
                  color='primary'
                  sx={{
                    width: '40px',
                    height: '24px',
                    borderRadius: '100px',
                    backgroundColor: (theme) =>
                      required ? '#000000' : theme.palette.grey[300],
                    '& .MuiSwitch-switchBase': {
                      width: '20.5px',
                      height: '20.5px',
                      padding: '0px',
                      top: '1.75px',
                      left: '1.75px',
                      color: '#FFFFFF',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#FFFFFF',
                      backgroundColor: '#000000 !important',
                    },
                    '& .MuiSwitch-thumb': {
                      boxShadow: 'none',
                    },
                    '& .MuiSwitch-switchBase:hover': {
                      backgroundColor: 'transparent',
                    },
                    '& .Mui-checked': {
                      transform: 'translateX(16px) !important',
                    },
                  }}
                />
              }
              label='Required'
              labelPlacement='end'
              sx={{
                marginLeft: 0,
                '& .MuiFormControlLabel-label': {
                  marginLeft: '8px',
                  fontSize: '17px',
                },
              }}
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
            'ui:options': uischema['ui:options'] ?? '',
          }}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onChange={(newComponentProps: { [key: string]: any }) => {
            onDependentsChange(newComponentProps.dependents);
            onChange(schema, {
              ...uischema,
              'ui:column': newComponentProps['ui:column'],
            });
          }}
          TypeSpecificParameters={CardDefaultParameterInputs}
        />
      </Collapse>
      {mods?.components?.add && mods.components.add(parentProperties)}
      {!mods?.components?.add && (
        <Add
          tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
          addElem={(choice: string) => {
            if (choice === 'card') {
              addCardObj(parentProperties);
            } else if (choice === 'section') {
              addSectionObj(parentProperties);
            }
            setCardOpen(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
