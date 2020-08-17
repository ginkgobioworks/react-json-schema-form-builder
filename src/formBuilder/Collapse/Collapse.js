// @flow

import React from 'react';
import type { Node } from 'react';
import { createUseStyles } from 'react-jss';
import { Collapse as RSCollapse } from 'reactstrap';
import classnames from 'classnames';

const useStyles = createUseStyles({
  collapseElement: {
    '& .disabled': { 'i.toggle-collapse': { cursor: 'default' } },
    '& h4': { marginTop: '7px', padding: '13px 10px 10px 10px' },
    '& i.toggle-collapse': {
      fontSize: '2.3rem',
      margin: '17px',
      cursor: 'pointer',
      marginLeft: '0',
    },
  },
});

type Props = {
  // Determines if the Collapse component is open
  isOpen: boolean,
  // Toggles the isOpen boolean between true and false
  toggleCollapse: () => void,
  // The title to display in the collapse header
  title: Node,
  // Anything to be rendered within the collapse
  children: any,
  // If true will gray out and disable */
  disableToggle?: boolean,
  className?: string,
};

const Collapse = (props: Props) => {
  const iconClasses = classnames({
    'toggle-collapse': true,
    fas: true,
    'fa-caret-down': props.isOpen,
    'fa-caret-right': !props.isOpen,
  });

  const classes = classnames(
    `collapse-element ${props.className || ''} ${useStyles().collapseElement}`,
    {
      disabled: props.disableToggle,
    }
  );

  return (
    <div className={classes}>
      <div className="d-flex">
        <i
          onClick={!props.disableToggle ? props.toggleCollapse : () => {}}
          className={iconClasses}
        />
        <h4>{props.title}</h4>
      </div>
      <RSCollapse isOpen={props.isOpen}>
        <div>{props.children}</div>
      </RSCollapse>
    </div>
  );
};

export default Collapse;
