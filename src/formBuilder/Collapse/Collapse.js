// @flow

import React from 'react';
import type { Node } from 'react';
import { createUseStyles } from 'react-jss';
import { Collapse as RSCollapse } from 'reactstrap';
import classnames from 'classnames';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from '../FontAwesomeIcon';

const useStyles = createUseStyles({
  collapseElement: {
    '& .disabled': { '.toggle-collapse': { cursor: 'default' } },
    '& h4': { marginTop: '7px', padding: '13px 10px 10px 10px' },
    '& .toggle-collapse': {
      fontSize: '2.3rem',
      cursor: 'pointer',
      marginLeft: '33px',
      '& .fa-caret-right': {
        marginRight: '9px',
      },
    },
    '& .collapse-head': {
      backgroundColor: '#8FCAE7',
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

export default function Collapse(props: Props): Node {
  const classes = classnames(
    `collapse-element ${props.className || ''} ${useStyles().collapseElement}`,
    {
      disabled: props.disableToggle,
    },
  );

  return (
    <div className={classes}>
      <div className='d-flex collapse-head'>
        <span className='toggle-collapse'>
          <FontAwesomeIcon
            onClick={!props.disableToggle ? props.toggleCollapse : () => {}}
            icon={props.isOpen ? faCaretDown : faCaretRight}
          />
        </span>
        <h4>{props.title}</h4>
      </div>
      <RSCollapse isOpen={props.isOpen}>
        <div>{props.children}</div>
      </RSCollapse>
    </div>
  );
}
