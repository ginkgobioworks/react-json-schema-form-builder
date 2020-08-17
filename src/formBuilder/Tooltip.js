// @flow

/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import type { Node } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { createUseStyles } from 'react-jss';

const typeMap = {
  alert: `fas fa-asterisk`,
  help: 'fa fa-question-circle',
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
  text: Node,
  type: 'alert' | 'help',
  id: string,
}) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <span
        style={{ textDecoration: 'underline', color: 'blue' }}
        href="#"
        id={id}
      >
        <i className={typeMap[type]}></i>
      </span>
      <UncontrolledTooltip
        autohide={false}
        className={classes.toolTip}
        placement="top"
        target={id}
      >
        {text}
      </UncontrolledTooltip>
    </React.Fragment>
  );
}
