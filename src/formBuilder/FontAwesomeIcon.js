// @flow

import React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon as FortAwesomeFontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Node } from 'react';

export default function FontAwesomeIcon({
  className,
  ...otherProps
}: {
  className?: string,
  [string]: any,
}): Node {
  const props = Object.assign(
    { className: classnames([className, 'fa']) },
    otherProps,
  );
  return <FortAwesomeFontAwesomeIcon {...props} />;
}
