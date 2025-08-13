import React, { useState, ReactElement } from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  UncontrolledTooltip,
  Button,
} from 'reactstrap';
import { createUseStyles } from 'react-jss';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from './FontAwesomeIcon';
import FBRadioGroup from './radio/FBRadioGroup';
import { getRandomId } from './utils';
import type { ModLabels } from './types';

const useStyles = createUseStyles({
  addDetails: {
    '& .popover': {
      width: '400px',
      zIndex: '1051 !important',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
      '& .popover-header': {
        fontWeight: 'bold',
        fontSize: '14px',
        padding: '15px 15px',
        borderBottom: '1px solid #e4e4e7',
        backgroundColor: '#FFFFFF'
      },
      '& .popover-body': {
        padding: '10px 15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      },
      '& .choose-create': {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '12px',
        '& label': {
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          color: '#333',
          cursor: 'pointer',
          gap: '8px',
          '& input[type="radio"]': {
            appearance: 'none',
            width: '16px',
            height: '16px',
            border: '2px solid #333',
            borderRadius: '50%',
            display: 'inline-block',
            position: 'relative',
            cursor: 'pointer',
            backgroundColor: '#FFFFFF',
            '&:checked': {
              border: '5px solid #000 !important',
              backgroundColor: '#000 !important', 
            },
          },
        },
      },
      
      '& .action-buttons': {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
        marginTop: '12px',
        '& button': {
          borderRadius: '6px',
          fontSize: '14px',
          padding: '8px 16px',
        },
        '& .btn-primary': {
          backgroundColor: '#000',
          borderColor: '#000',
        },
      },
    },
  },
  addButton: {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '14px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    margin: 'auto',
    gap: '6px',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#333',
    },
  },
});

export default function Add({
  addElem,
  hidden,
  tooltipDescription,
  labels,
}: {
  addElem: (choice: string) => void;
  hidden?: boolean;
  tooltipDescription?: string;
  labels?: ModLabels;
}): ReactElement {
  const classes = useStyles();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [createChoice, setCreateChoice] = useState('card');
  const [elementId] = useState(getRandomId());

  return (
    <div style={{ display: hidden ? 'none' : 'initial' }}>
      {/* Add Button */}
      <button
        id={`${elementId}_add`}
        className={classes.addButton}
        onClick={() => setPopoverOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} />
        Add
      </button>

      <UncontrolledTooltip placement="top" target={`${elementId}_add`}>
        {tooltipDescription || 'Create new form element'}
      </UncontrolledTooltip>

      {/* Popover */}
      <Popover
        placement="bottom"
        target={`${elementId}_add`}
        isOpen={popoverOpen}
        toggle={() => setPopoverOpen(false)}
        className={`add-details ${classes.addDetails}`}
        id={`${elementId}_add_popover`}
      >
        <PopoverHeader>Create New</PopoverHeader>
        <PopoverBody>
          {/* Radio Group */}
          <FBRadioGroup
            className="choose-create"
            defaultValue={createChoice}
            horizontal={false}
            options={[
              {
                value: 'section',
                label: labels?.addSectionLabel ?? 'Form section',
              },
              {
                value: 'card',
                label: labels?.addElementLabel ?? 'Form element',
              },
            ]}
            onChange={(selection) => {
              setCreateChoice(selection);
            }}
          />

          {/* Action Buttons */}
          <div className="action-buttons">
            <Button onClick={() => setPopoverOpen(false)} className="btn-primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                addElem(createChoice);
                setPopoverOpen(false);
              }}
              color="primary"
              className="btn-primary"
            >
              Create
            </Button>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
