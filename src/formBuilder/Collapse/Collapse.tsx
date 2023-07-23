import React, { FC, ReactNode, MouseEvent } from 'react';
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
  },
});

interface CollapseProps {
  // Determines if the Collapse component is open
  isOpen: boolean;
  // Toggles the isOpen boolean between true and false
  toggleCollapse: (event: MouseEvent<SVGSVGElement>) => void;
  // The title to display in the collapse header
  title: ReactNode;
  // Anything to be rendered within the collapse
  children: Array<ReactNode>;
  // If true will gray out and disable */
  disableToggle?: boolean;
  className?: string;
}

const Collapse: FC<CollapseProps> = (props) => {
  const classes = classnames(
    `collapse-element ${props.className || ''} ${useStyles().collapseElement}`,
    {
      disabled: props.disableToggle,
    },
  );

  return (
    <div className={classes}>
      <div className='d-flex'>
        <span className='toggle-collapse'>
          <FontAwesomeIcon
            onClick={(event) => {
              if (!props.disableToggle) {
                props.toggleCollapse(event);
              }
            }}
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
};

export default Collapse;
