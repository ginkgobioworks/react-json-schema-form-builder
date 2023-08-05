import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  Button,
  ModalBody,
  ModalFooter,
  Input,
} from 'reactstrap';
import { createUseStyles } from 'react-jss';
import DependencyField from './dependencies/DependencyField';
import type { CardModalType, CardComponentPropsType } from './types';
import Tooltip from './Tooltip';

const useStyles = createUseStyles({
  cardModal: {
    '& .card-modal-header': { paddingTop: '.5em', paddingBottom: '.5em' },
    '& .card-modal-entries': { padding: '1em' },
    '& h4, h5, p, label, li': { marginTop: '.5em', marginBottom: '.5em' },
    '& h5, p, label, li': { fontSize: '14px' },
    '& h4': { fontSize: '16px' },
    '& h3': { fontSize: '18px', marginBottom: 0 },
    '& .card-modal-entries > div > input': {
      marginBottom: '1em',
      height: '32px',
    },
    '& .fa-question-circle, & .fa-circle-question': { color: 'gray' },
    '& .card-modal-boolean': {
      '& *': { marginRight: '0.25em', height: 'auto', display: 'inline-block' },
    },
    '& .card-modal-select': {
      '& input': { margin: '0', height: '20px' },
      marginBottom: '1em',
    },
  },
});

const CardModal: CardModalType = ({
  componentProps,
  onChange,
  isOpen,
  onClose,
  TypeSpecificParameters,
}) => {
  const classes = useStyles();
  // assign state values for parameters that should only change on hitting "Save"
  const [componentPropsState, setComponentProps] = useState(componentProps);

  useEffect(() => {
    setComponentProps(componentProps);
  }, [componentProps]);

  return (
    <Modal isOpen={isOpen} data-test='card-modal' className={classes.cardModal}>
      <ModalHeader className='card-modal-header'>
        <div style={{ display: componentProps.hideKey ? 'none' : 'initial' }}>
          <h3>Additional Settings</h3>
        </div>
      </ModalHeader>
      <ModalBody className='card-modal-entries'>
        <TypeSpecificParameters
          parameters={componentPropsState}
          onChange={(newState: CardComponentPropsType) => {
            setComponentProps({
              ...componentPropsState,
              ...newState,
            });
          }}
        />
        <div>
          <h4>
            Column Size{' '}
            <a
              href='https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Tooltip
                id='column_size_tooltip'
                type='help'
                text='Set the column size of the input'
              />
            </a>
          </h4>
          <Input
            value={
              componentPropsState['ui:column']
                ? componentPropsState['ui:column']
                : ''
            }
            placeholder='Column size'
            key='ui:column'
            type='number'
            min={0}
            onChange={(ev) => {
              setComponentProps({
                ...componentPropsState,
                'ui:column': ev.target.value,
              });
            }}
            className='card-modal-text'
          />
        </div>
        <DependencyField
          parameters={componentPropsState}
          onChange={(newState) => {
            setComponentProps({
              ...componentPropsState,
              ...newState,
            });
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            onClose();
            onChange(componentPropsState);
          }}
          color='primary'
        >
          Save
        </Button>
        <Button
          onClick={() => {
            onClose();
            setComponentProps(componentProps);
          }}
          color='secondary'
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CardModal;
