/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { ReactElement } from 'react';
import Tooltip from '@mui/material/Tooltip';
import StarIcon from '@mui/icons-material/Star';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const typeMap = {
  alert: StarIcon,
  help: HelpOutlineIcon,
};

export default function TooltipComponent({
  text,
  type,
}: {
  text: string;
  type: 'alert' | 'help';
}): ReactElement {
  const IconComponent = typeMap[type];
  return (
    <Tooltip title={text} placement='top'>
      <IconComponent
        fontSize='small'
        color={type === 'alert' ? 'warning' : 'action'}
        sx={{ verticalAlign: 'middle', cursor: 'help' }}
      />
    </Tooltip>
  );
}
