// @flow

import * as React from 'react';
import { Modal, ModalHeader, Button, ModalBody, ModalFooter } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import DependencyField from './dependencies/DependencyField';
import type { Parameters } from './types';

const useStyles = createUseStyles({
  cardModal: {
    '& .card-modal-entries': { padding: '1em' },
    '& h4, h5, p, label, li': { fontSize: '14px', marginBottom: '0' },
    '& h3': { fontSize: '16px' },
    '& > input': { marginBottom: '1em', height: '32px' },
    '& .fa-question-circle': { color: 'var(--gray)' },
    '& .card-modal-boolean': {
      '& *': { marginRight: '0.25em', height: 'auto', display: 'inline-block' },
    },
    '& .card-modal-select': {
      '& input': { margin: '0', height: '20px' },
      marginBottom: '1em',
    },
  },
});

export default function CardModal({
  componentProps,
  onChange,
  isOpen,
  onClose,
  TypeSpecificParameters,
}: {
  componentProps: {
    [string]: any,
  },
  onChange: (any) => void,
  isOpen: boolean,
  onClose: () => void,
  TypeSpecificParameters: React.AbstractComponent<{
    parameters: Parameters,
    onChange: (newParams: Parameters) => void,
  }>,
}) {
  const classes = useStyles();
  // assign state values for parameters that should only change on hitting "Save"
  const [componentPropsState, setComponentProps] = React.useState(
    componentProps
  );

  React.useEffect(() => {
    setComponentProps(componentProps);
  }, [componentProps]);

  return (
    <Modal isOpen={isOpen} data-test="card-modal" className={classes.cardModal}>
      <ModalHeader className="card-modal-header">
        <div style={{ display: componentProps.hideKey ? 'none' : 'initial' }}>
          <h5>Additional Settings</h5>
        </div>
      </ModalHeader>
      <ModalBody className="card-modal-entries">
        <TypeSpecificParameters
          parameters={componentPropsState}
          onChange={(newState: any) => {
            setComponentProps({
              ...componentPropsState,
              ...newState,
            });
          }}
        />
        <DependencyField
          parameters={(componentPropsState: { [string]: any })}
          onChange={(newState: any) => {
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
          color="primary"
        >
          Save
        </Button>
        <Button
          onClick={() => {
            onClose();
          }}
          color="secondary"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
