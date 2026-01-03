import React, { FC, ReactNode, memo } from 'react';
import MuiCollapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface CollapseProps {
  // Determines if the Collapse component is open
  isOpen: boolean;
  // Toggles the isOpen boolean between true and false
  toggleCollapse: () => void;
  // The title to display in the collapse header
  title: ReactNode;
  // Anything to be rendered within the collapse
  children: Array<ReactNode>;
  // If true will gray out and disable */
  disableToggle?: boolean;
  className?: string;
  'data-testid'?: string;
}

const Collapse: FC<CollapseProps> = (props) => {
  return (
    <Paper
      variant='outlined'
      className={props.className || ''}
      data-testid={props['data-testid']}
      sx={{
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: props.isOpen ? 1 : 0,
          borderColor: 'divider',
          px: 1,
          py: 0.5,
        }}
      >
        <IconButton
          size='small'
          disabled={props.disableToggle}
          onClick={() => {
            if (!props.disableToggle) {
              props.toggleCollapse();
            }
          }}
          sx={{ mr: 1 }}
        >
          {props.isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Typography
          variant='subtitle1'
          component='div'
          sx={{
            flexGrow: 1,
            color: 'primary.main',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {props.title}
        </Typography>
      </Box>
      <MuiCollapse in={props.isOpen}>
        <Box sx={{ p: 2 }}>{props.children}</Box>
      </MuiCollapse>
    </Paper>
  );
};

export default memo(Collapse);
