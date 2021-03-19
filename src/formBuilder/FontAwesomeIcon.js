// @flow

import React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon as FortAwesomeFontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FontAwesomeIcon({
  className,
  ...otherProps
}: {
  [string]: any,
}) {
  return (
    <FortAwesomeFontAwesomeIcon
      className={classnames([className, 'fa'])}
      {...otherProps}
    />
  );
}
