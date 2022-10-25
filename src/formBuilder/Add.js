// @flow

import React, { useState } from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  UncontrolledTooltip,
  Button,
} from 'reactstrap';
import { createUseStyles } from 'react-jss';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from './FontAwesomeIcon';
import FBRadioGroup from './radio/FBRadioGroup';
import { getRandomId } from './utils';
import type { Node } from 'react';

const useStyles = createUseStyles({
  addDetails: {
    '& .popover': {
      width: '300px',
      'z-index': '1051 !important',
      '& .popover-inner': {
        border: '10px solid #000',
        borderRadius: '4px',
        '& .popover-header': { borderBottom: '1px solid #1d71ad' },
        '& .action-buttons': {
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '.5em',
        },
      },
    },
  },
});

export default function Add({
  addElem,
  hidden,
  tooltipDescription,
}: {
  addElem: (choice: string) => void,
  hidden?: boolean,
  tooltipDescription?: string,
}): Node {
  const classes = useStyles();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [createChoice, setCreateChoice] = useState('card');
  const [elementId] = useState(getRandomId());

  return (
    <div style={{ display: hidden ? 'none' : 'initial' }}>
      <span id={`${elementId}_add`}>
        <FontAwesomeIcon
          icon={faPlusSquare}
          onClick={() => setPopoverOpen(true)}
        />
      </span>
      <UncontrolledTooltip placement='top' target={`${elementId}_add`}>
        {tooltipDescription || 'Create new form element'}
      </UncontrolledTooltip>
      <Popover
        placement='bottom'
        target={`${elementId}_add`}
        isOpen={popoverOpen}
        toggle={() => setPopoverOpen(false)}
        className={`add-details ${classes.addDetails}`}
        id={`${elementId}_add_popover`}
      >
        <PopoverHeader>Create New</PopoverHeader>
        <PopoverBody>
          <FBRadioGroup
            className='choose-create'
            defaultValue={createChoice}
            horizontal={false}
            options={[
              {
                value: 'card',
                label: 'Form element',
              },
              {
                value: 'section',
                label: 'Form section',
              },
            ]}
            onChange={(selection) => {
              setCreateChoice(selection);
            }}
          />
          <div className='action-buttons'>
            <Button onClick={() => setPopoverOpen(false)} color='secondary'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                addElem(createChoice);
                setPopoverOpen(false);
              }}
              color='primary'
            >
              Create
            </Button>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
