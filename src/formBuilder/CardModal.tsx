import React, { useState, useRef, useCallback, memo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import DependencyField from './dependencies/DependencyField';
import type { CardModal, CardComponentProps } from './types';
import Tooltip from './Tooltip';

const CardModalComponent: CardModal = ({
  componentProps,
  onChange,
  isOpen,
  onClose,
  TypeSpecificParameters,
}) => {
  // assign state values for parameters that should only change on hitting "Save"
  const [localProps, setLocalProps] = useState(componentProps);

  // Snapshot props into local state when the modal opens, using a ref
  // to detect the false→true transition without an effect double-render
  const prevIsOpenRef = useRef(isOpen);
  if (isOpen && !prevIsOpenRef.current) {
    setLocalProps(componentProps);
  }
  prevIsOpenRef.current = isOpen;

  const handleTypeSpecificChange = useCallback(
    (newState: CardComponentProps) => {
      setLocalProps((prev) => ({
        ...prev,
        ...newState,
      }));
    },
    [],
  );

  const handleColumnSizeChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setLocalProps((prev) => ({
        ...prev,
        'ui:column': ev.target.value,
      }));
    },
    [],
  );

  const handleDependencyChange = useCallback(
    (newState: Partial<CardComponentProps>) => {
      setLocalProps((prev) => ({
        ...prev,
        ...newState,
      }));
    },
    [],
  );

  const handleCancel = useCallback(() => {
    onClose();
    setLocalProps(componentProps);
  }, [onClose, componentProps]);

  const handleSave = useCallback(() => {
    onClose();
    onChange(localProps);
  }, [onClose, onChange, localProps]);

  return (
    <Dialog open={isOpen} data-testid='card-modal' maxWidth='sm' fullWidth>
      {!componentProps.hideKey && (
        <DialogTitle>Additional Settings</DialogTitle>
      )}
      <DialogContent dividers>
        <Stack spacing={3}>
          <TypeSpecificParameters
            parameters={localProps}
            onChange={handleTypeSpecificChange}
          />
          <Typography
            variant='subtitle2'
            fontWeight='bold'
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
          >
            Column Size{' '}
            <Link
              href='https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Tooltip type='help' text='Set the column size of the input' />
            </Link>
          </Typography>
          <TextField
            value={localProps['ui:column'] || ''}
            placeholder='Column size'
            type='number'
            inputProps={{ min: 0 }}
            onChange={handleColumnSizeChange}
            size='small'
            fullWidth
          />
          <DependencyField
            parameters={localProps}
            onChange={handleDependencyChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color='inherit'>
          Cancel
        </Button>
        <Button onClick={handleSave} variant='contained' color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(CardModalComponent);
