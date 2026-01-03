import React, { ReactElement, memo, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FBCheckbox from './FBCheckbox';
import Collapse from './Collapse/Collapse';
import CardModal from './CardModal';
import CardGeneralParameterInputs from './CardGeneralParameterInputs';
import Add from './Add';
import TooltipComponent from './Tooltip';
import type { CardComponentPropsInternal, CardComponentProps } from './types';

function Card({
  componentProps,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  TypeSpecificParameters,
  addElem,
  cardOpen,
  setCardOpen,
  allFormInputs,
  mods,
  showObjectNameInput = true,
  addProperties,
}: CardComponentPropsInternal): ReactElement {
  const [modalOpen, setModalOpen] = useState(false);

  const handleToggleCollapse = useCallback(() => {
    setCardOpen(!cardOpen);
  }, [cardOpen]);

  const handleModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleRequiredToggle = useCallback(() => {
    onChange({
      ...componentProps,
      required: !componentProps.required,
    });
  }, [onChange, componentProps]);

  const handleMoveUp = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onMoveUp?.();
    },
    [onMoveUp],
  );

  const handleMoveDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onMoveDown?.();
    },
    [onMoveDown],
  );

  const handleDelete = useCallback(() => {
    onDelete?.();
  }, [onDelete]);

  const handleModalSave = useCallback(
    (newComponentProps: CardComponentProps) => {
      onChange(newComponentProps);
    },
    [onChange],
  );

  const handleAddElem = useCallback(
    (choice: string) => {
      addElem?.(choice);
    },
    [addElem],
  );

  return (
    <>
      <Collapse
        isOpen={cardOpen}
        toggleCollapse={handleToggleCollapse}
        title={
          <Stack direction='row' spacing={0.5} alignItems='center'>
            <Box
              component='span'
              onClick={handleToggleCollapse}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {componentProps.title || componentProps.name}{' '}
              {componentProps.parent && (
                <TooltipComponent
                  text={`Depends on ${componentProps.parent}`}
                  type='alert'
                />
              )}
              {componentProps.$ref !== undefined && (
                <TooltipComponent
                  text={`Is an instance of pre-configured component ${componentProps.$ref}`}
                  type='alert'
                />
              )}
            </Box>
            <Stack direction='row' spacing={0.5}>
              <Tooltip title='Move form element up' placement='top'>
                <IconButton
                  size='small'
                  onClick={handleMoveUp}
                  aria-label='Move form element up'
                >
                  <ArrowUpwardIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Move form element down' placement='top'>
                <IconButton
                  size='small'
                  onClick={handleMoveDown}
                  aria-label='Move form element down'
                >
                  <ArrowDownwardIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        }
        data-testid='card-container'
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2 }}>
          <CardGeneralParameterInputs
            parameters={componentProps}
            onChange={onChange}
            allFormInputs={allFormInputs}
            mods={mods}
            showObjectNameInput={showObjectNameInput}
          />
        </Box>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Stack direction='row' spacing={0.5}>
            <Tooltip
              title='Additional configurations for this form element'
              placement='top'
            >
              <IconButton
                size='small'
                onClick={handleModalOpen}
                color='primary'
                aria-label='Additional configurations'
              >
                <EditIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete form element' placement='top'>
              <IconButton
                size='small'
                onClick={handleDelete}
                color='error'
                aria-label='Delete form element'
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Stack>
          <Box
            sx={{
              alignItems: 'center',
              borderLeft: 1,
              borderColor: 'divider',
              pl: 2,
            }}
          >
            <FBCheckbox
              onChangeValue={handleRequiredToggle}
              isChecked={!!componentProps.required}
              label='Required'
            />
          </Box>
        </Stack>
        <CardModal
          componentProps={componentProps as CardComponentProps}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onChange={handleModalSave}
          TypeSpecificParameters={TypeSpecificParameters}
        />
      </Collapse>
      {mods?.components?.add && mods?.components?.add(addProperties)}
      {!mods?.components?.add && addElem && (
        <Add
          tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
          addElem={handleAddElem}
        />
      )}
    </>
  );
}

export default memo(Card);
