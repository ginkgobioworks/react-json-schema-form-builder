import React, { ReactElement } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import {
  faArrowUp,
  faArrowDown,
  faTrash,
  faPen,
  faChevronCircleUp,
  faChevronCircleDown,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import FBCheckbox from './checkbox/FBCheckbox';
import Collapse from './Collapse/Collapse';
import CardModal from './CardModal';
import CardGeneralParameterInputs from './CardGeneralParameterInputs';
import Add from './Add';
import FontAwesomeIcon from './FontAwesomeIcon';
import Tooltip from './Tooltip';
import { getRandomId } from './utils';
import type { CardPropsType, CardComponentPropsType } from './types';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const useStyles = createUseStyles({
  container: {
    width: '100%',
  },
  cardEntries: {
    'border-bottom': '1px solid #E4E4E7',
    margin: '.5em 1.5em 0 1.5em',
    '& h5': {
      color: 'black',
      'font-size': '14px',
      'font-weight': 'bold',
    },
    '& .card-entry-row': {
      display: 'flex',
    },
    '& .card-entry': {
      margin: 0,
      width: '100%',
      'text-align': 'left',
      padding: '0.5em',
      '&.wide-card-entry': {
        width: '100%',
      },
    },
    '& input': {
      // border: '1px solid gray',
      'border-radius': '4px',
    },
    '& .card-category-options': {
      padding: '.25em',
    },
    '& .card-select': {
      // border: '1px solid gray',
      'border-radius': '4px',
    },
    '& .card-array': {
      '& .fa-plus-square, & .fa-square-plus': { display: 'none' },
      '& .section-entries': {
        '& .fa-plus-square, & .fa-square-plus': { display: 'initial' },
      },
    },
    '& .card-enum': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      backgroundColor: 'lightGray',
      textAlign: 'left',
      padding: '1em',
      '& h3': { fontSize: '16px', margin: '0 0 .5em 0' },
      '& label': { color: 'black', fontSize: '14px' },
      '& .card-enum-header': {
        marginTop: '0.5em',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        '& h5': { width: '50%', fontWeight: 'bold', fontSize: '14px' },
      },
      '& .fa': { cursor: 'pointer' },
    },
  },
  cardInteractions: {
    margin: '1em 1em',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '15px',
    '& .fa': {
      marginRight: '1em',
      borderRadius: '4px',
      padding: '.25em',
      height: '25px',
      width: '25px',
    },
    '& .fa-arrow-up, .fa-arrow-down': { marginRight: '.5em' },
    '& .fb-checkbox': { display: 'inline-block' },
    '& .interactions-left, & .interactions-right': {
      display: 'inline-block',
      width: '48%',
      margin: '0 auto',
    },
    '& .interactions-left': { textAlign: 'left' },
    '& .interactions-right': { textAlign: 'right' },
  },
  iconContainer: {
    cursor: 'pointer',
  },
});

export const EditIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M21.1739 6.81238C21.7026 6.2838 21.9997 5.56685 21.9998 4.81923C21.9999 4.07162 21.703 3.35459 21.1744 2.82588C20.6459 2.29717 19.9289 2.00009 19.1813 2C18.4337 1.99991 17.7166 2.2968 17.1879 2.82538L3.84193 16.1744C3.60975 16.4059 3.43805 16.6909 3.34193 17.0044L2.02093 21.3564C1.99509 21.4429 1.99314 21.5347 2.01529 21.6222C2.03743 21.7097 2.08285 21.7896 2.14673 21.8534C2.21061 21.9172 2.29055 21.9624 2.37809 21.9845C2.46563 22.0065 2.55749 22.0044 2.64393 21.9784L6.99693 20.6584C7.3101 20.5631 7.59511 20.3925 7.82693 20.1614L21.1739 6.81238Z'
      stroke='black'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M15 5L19 9'
      stroke='black'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const DeleteIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M9.33211 3.33211C9.09745 3.56676 9 3.82523 9 4V5H15V4C15 3.82523 14.9025 3.56676 14.6679 3.33211C14.4332 3.09745 14.1748 3 14 3H10C9.82523 3 9.56676 3.09745 9.33211 3.33211ZM17 5V4C17 3.17477 16.5975 2.43324 16.0821 1.91789C15.5668 1.40255 14.8252 1 14 1H10C9.17477 1 8.43324 1.40255 7.91789 1.91789C7.40255 2.43324 7 3.17477 7 4V5H3C2.44772 5 2 5.44772 2 6C2 6.55228 2.44772 7 3 7H4V20C4 20.8252 4.40255 21.5668 4.91789 22.0821C5.43324 22.5975 6.17477 23 7 23H17C17.8252 23 18.5668 22.5975 19.0821 22.0821C19.5975 21.5668 20 20.8252 20 20V7H21C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5H17ZM6 7V20C6 20.1748 6.09745 20.4332 6.33211 20.6679C6.56676 20.9025 6.82523 21 7 21H17C17.1748 21 17.4332 20.9025 17.6679 20.6679C17.9025 20.4332 18 20.1748 18 20V7H6ZM10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10Z'
      fill='#DC2626'
    />
  </svg>
);

export default function Card({
  componentProps,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  TypeSpecificParameters,
  addElem,
  cardOpen,
  setCardOpen,
  allFormInputs,
  mods,
  showObjectNameInput = true,
  addProperties,
}: CardPropsType): ReactElement {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [elementId] = React.useState(getRandomId());

  return (
    <React.Fragment>
      <div className={classes.container}>
        <Collapse
          backgroundColor='#FAFAFA'
          isOpen={cardOpen}
          toggleCollapse={() => setCardOpen(!cardOpen)}
          title={
            <React.Fragment>
              <span onClick={() => setCardOpen(!cardOpen)} className='label'>
                {componentProps.title || componentProps.name}{' '}
                {componentProps.parent ? (
                  <Tooltip
                    text={`Depends on ${componentProps.parent}`}
                    id={`${elementId}_parentinfo`}
                    type='alert'
                  />
                ) : (
                  ''
                )}
                {componentProps.$ref !== undefined ? (
                  <Tooltip
                    text={`Is an instance of pre-configured component ${componentProps.$ref}`}
                    id={`${elementId}_refinfo`}
                    type='alert'
                  />
                ) : (
                  ''
                )}
              </span>
              <span className='arrows' style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px'}}>
                {/* <span id={`${elementId}_moveupbiginfo`}>
                <FontAwesomeIcon
                  icon={faChevronUp}
                  onClick={() => (onMoveUp ? onMoveUp() : {})}
                />
              </span> */}
                {/* <UncontrolledTooltip
                placement='top'
                target={`${elementId}_moveupbiginfo`}
              >
                Move form element up */}
                {/* </UncontrolledTooltip> */}
                <span
                  id={`${elementId}_trashinfo`}
                  onClick={() => onDelete && onDelete()}
                  className={classes.iconContainer}
                >
                  <DeleteIcon />
                </span>
                <span>
                  <UncontrolledTooltip
                    placement='top'
                    target={`${elementId}_trashinfo`}
                  >
                    Delete form element
                  </UncontrolledTooltip>
                </span>
                <span id={`${elementId}_movedownbiginfo`}>
                  <FontAwesomeIcon
                    style={{ marginRight: '15px' }}
                    icon={ cardOpen ? faChevronUp : faChevronDown}
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
          className={`card-container ${
            componentProps.dependent ? 'card-dependent' : ''
          } ${componentProps.$ref === undefined ? '' : 'card-reference'}`}
        >
          <div className={classes.cardEntries}>
            <CardGeneralParameterInputs
              parameters={componentProps}
              onChange={onChange}
              allFormInputs={allFormInputs}
              mods={mods}
              showObjectNameInput={showObjectNameInput}
            />
          </div>
          <div className={classes.cardInteractions}>
            <div
              id={`${elementId}_editinfo`}
              onClick={() => setModalOpen(true)}
              className={classes.iconContainer}
            >
              <EditIcon />
            </div>
            <UncontrolledTooltip
              placement='top'
              target={`${elementId}_editinfo`}
            >
              Additional configurations for this form element
            </UncontrolledTooltip>
            <FormControlLabel
              control={
                <Switch
                  checked={!!componentProps.required}
                  onChange={() =>
                    onChange({
                      ...componentProps,
                      required: !componentProps.required,
                    })
                  }
                  color='primary'
                  sx={{
                    width: '40px',
                    height: '24px',
                    borderRadius: '100px',
                    backgroundColor: (theme) =>
                      componentProps.required ? '#000000' : '#E4E4E7',
                    '& .MuiSwitch-switchBase': {
                      width: '20.5px',
                      height: '20.5px',
                      padding: '0px',
                      top: '1.75px',
                      left: '1.75px',
                      color: (theme) => '#974RB29',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: (theme) => '#FFFFFF',
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
                  marginLeft: '8px', // Add some spacing between label and switch
                },
              }}
            />
          </div>
          <CardModal
            componentProps={componentProps as CardComponentPropsType}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onChange={(newComponentProps: CardComponentPropsType) => {
              onChange(newComponentProps);
            }}
            TypeSpecificParameters={TypeSpecificParameters}
          />
        </Collapse>
        {mods?.components?.add && mods?.components?.add(addProperties)}
        {!mods?.components?.add && addElem && (
          <Add
            tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
            addElem={(choice: string) => addElem(choice)}
          />
        )}
      </div>
    </React.Fragment>
  );
}
