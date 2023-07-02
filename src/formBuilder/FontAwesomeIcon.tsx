import React, { FC } from 'react';
import classnames from 'classnames';
import {
  FontAwesomeIcon as FortAwesomeFontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

const FontAwesomeIcon: FC<FontAwesomeIconProps> = ({
  className,
  ...otherProps
}) => {
  const props = Object.assign(
    { className: classnames([className, 'fa']) },
    otherProps,
  );
  return <FortAwesomeFontAwesomeIcon {...props} />;
};

export default FontAwesomeIcon;
