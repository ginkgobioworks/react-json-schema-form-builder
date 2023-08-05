/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { ReactElement } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { createUseStyles } from 'react-jss';
import {
  faAsterisk,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from './FontAwesomeIcon';

const typeMap = {
  alert: faAsterisk,
  help: faQuestionCircle,
};

const useStyles = createUseStyles({
  toolTip: {
    color: 'white',
    'background-color': 'black',
  },
});

export default function Example({
  text,
  type,
  id,
}: {
  text: string;
  type: 'alert' | 'help';
  id: string;
}): ReactElement {
  const classes = useStyles();

  return (
    <React.Fragment>
      <span style={{ textDecoration: 'underline', color: 'blue' }} id={id}>
        <FontAwesomeIcon icon={typeMap[type]} />
      </span>
      <UncontrolledTooltip
        autohide={false}
        className={classes.toolTip}
        placement='top'
        target={id}
      >
        {text}
      </UncontrolledTooltip>
    </React.Fragment>
  );
}
