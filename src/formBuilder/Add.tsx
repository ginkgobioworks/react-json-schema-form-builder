import React, { useState, ReactElement, useCallback, memo } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import FBRadioGroup from './radio/FBRadioGroup';
import type { ModLabels } from './types';

function Add({
  addElem,
  hidden,
  tooltipDescription,
  labels,
}: {
  addElem: (choice: string) => void;
  hidden?: boolean;
  tooltipDescription?: string;
  labels?: ModLabels;
}): ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [createChoice, setCreateChoice] = useState('card');
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleChoiceChange = useCallback((selection: string) => {
    setCreateChoice(selection);
  }, []);

  const handleCreate = useCallback(() => {
    addElem(createChoice);
    setAnchorEl(null);
  }, [addElem, createChoice]);

  const open = Boolean(anchorEl);

  if (hidden) return <></>;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 1,
        my: 0.5,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Tooltip title={tooltipDescription || 'Add element here'} placement='top'>
        <IconButton
          onClick={handleClick}
          size='small'
          aria-label='Create new form element'
          sx={{
            transition: 'all 0.2s ease',
            bgcolor: isHovered || open ? 'primary.main' : 'grey.100',
            color: isHovered || open ? 'primary.contrastText' : 'grey.500',
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            },
          }}
        >
          <AddIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 2 }}>
            Create New
          </Typography>
          <FBRadioGroup
            defaultValue={createChoice}
            horizontal={false}
            options={[
              {
                value: 'card',
                label: labels?.addElementLabel ?? 'Form element',
              },
              {
                value: 'section',
                label: labels?.addSectionLabel ?? 'Form section',
              },
            ]}
            onChange={handleChoiceChange}
          />
          <Stack
            direction='row'
            spacing={1}
            justifyContent='flex-end'
            sx={{ mt: 2 }}
          >
            <Button
              onClick={handleClose}
              variant='outlined'
              color='inherit'
              size='small'
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              variant='contained'
              color='primary'
              size='small'
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
}

export default memo(Add);
