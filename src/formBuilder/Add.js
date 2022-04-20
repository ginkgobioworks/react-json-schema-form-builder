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
import type { Mods } from './types';

const useStyles = createUseStyles({
  addDetails: {
    '& .popover': {
      width: '300px',
      'z-index': '1051 !important',
      '& .popover-inner': {
        border: '1px solid #1d71ad',
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
  mods,
}: {
  addElem: (choice: string) => void,
  hidden?: boolean,
  mods?: Mods,
}): Node {
  const classes = useStyles();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [createChoice, setCreateChoice] = useState('card');
  const [elementId] = useState(getRandomId());

  const fetchLabel = (labelName: string, defaultLabel: string): string => {
    return mods && mods.labels && typeof mods.labels[labelName] === 'string'
      ? mods.labels[labelName]
      : defaultLabel;
  };

  const fetchTooltip = (
    tooltipName: string,
    defaultTooltip: string,
  ): string => {
    return mods &&
      mods.tooltipDescriptions &&
      typeof mods.tooltipDescriptions[tooltipName] === 'string'
      ? mods.tooltipDescriptions[tooltipName]
      : defaultTooltip;
  };

  const addTooltip = fetchTooltip('add', 'Create new form element');
  const addPopoverHeaderLabel = fetchLabel(
    'addPopoverHeaderLabel',
    'Create New',
  );
  const addPopoverFormElementLabel = fetchLabel(
    'addPopoverFormElementLabel',
    'Form element',
  );
  const addPopoverFormSectionLabel = fetchLabel(
    'addPopoverFormSectionLabel',
    'Form section',
  );
  const addPopoverCancelButtonLabel = fetchLabel(
    'addPopoverCancelButtonLabel',
    'Cancel',
  );
  const addPopoverCreateButtonLabel = fetchLabel(
    'addPopoverCreateButtonLabel',
    'Create',
  );

  return (
    <div style={{ display: hidden ? 'none' : 'initial' }}>
      <span id={`${elementId}_add`}>
        <FontAwesomeIcon
          icon={faPlusSquare}
          onClick={() => setPopoverOpen(true)}
        />
      </span>
      <UncontrolledTooltip placement='top' target={`${elementId}_add`}>
        {addTooltip}
      </UncontrolledTooltip>
      <Popover
        placement='bottom'
        target={`${elementId}_add`}
        isOpen={popoverOpen}
        toggle={() => setPopoverOpen(false)}
        className={`add-details ${classes.addDetails}`}
        id={`${elementId}_add_popover`}
      >
        <PopoverHeader>{addPopoverHeaderLabel}</PopoverHeader>
        <PopoverBody>
          <FBRadioGroup
            className='choose-create'
            defaultValue={createChoice}
            horizontal={false}
            options={[
              {
                value: 'card',
                label: addPopoverFormElementLabel,
              },
              {
                value: 'section',
                label: addPopoverFormSectionLabel,
              },
            ]}
            onChange={(selection) => {
              setCreateChoice(selection);
            }}
          />
          <div className='action-buttons'>
            <Button onClick={() => setPopoverOpen(false)} color='secondary'>
              {addPopoverCancelButtonLabel}
            </Button>
            <Button
              onClick={() => {
                addElem(createChoice);
                setPopoverOpen(false);
              }}
              color='primary'
            >
              {addPopoverCreateButtonLabel}
            </Button>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  );
}
