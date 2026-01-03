import React, {
  ReactElement,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import AlertTitle from '@mui/material/AlertTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FBCheckbox from './FBCheckbox';
import Collapse from './Collapse/Collapse';
import CardModal from './CardModal';
import { CardDefaultParameterInputs } from './defaults/defaultInputs';
import TooltipComponent from './Tooltip';
import Add from './Add';
import Card from './Card';
import {
  checkForUnsupportedFeatures,
  generateElementComponentsFromSchemas,
  countElementsFromSchema,
  addCardObj,
  addSectionObj,
  handleDndDragEnd,
} from './utils';
import SortableItem from './SortableItem';
import type { SectionPropsType, JsonSchema } from './types';

function Section({
  name,
  required,
  schema,
  uischema,
  onChange,
  onNameChange,
  onRequireToggle,
  onDependentsChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  path,
  definitionData,
  definitionUi,
  hideKey,
  reference,
  dependents,
  parent,
  parentProperties,
  neighborNames,
  cardOpen,
  setCardOpen,
  allFormInputs,
  mods,
  categoryHash,
}: SectionPropsType): ReactElement {
  const schemaData = useMemo(() => schema || {}, [schema]);

  const unsupportedFeatures = useMemo(
    () =>
      checkForUnsupportedFeatures(schemaData, uischema || {}, allFormInputs),
    [schemaData, uischema, allFormInputs],
  );

  const elementNum = countElementsFromSchema(schemaData);
  const defaultCollapseStates = useMemo(
    () => [...Array(elementNum)].map(() => false),
    [elementNum],
  );
  const [cardOpenArray, setCardOpenArray] = useState(defaultCollapseStates);

  // useState setter is already stable and functional updates automatically use latest state

  // keep name in state to avoid losing focus
  const [keyName, setKeyName] = useState(name);
  const [keyError, setKeyError] = useState<null | string>(null);
  // keep requirements in state to avoid rapid updates
  const [modalOpen, setModalOpen] = useState(false);

  const addProperties = useMemo(
    () => ({
      schema,
      uischema,
      mods,
      onChange,
      definitionData,
      definitionUi,
      categoryHash,
    }),
    [
      schema,
      uischema,
      mods,
      onChange,
      definitionData,
      definitionUi,
      categoryHash,
    ],
  );

  const hideAddButton = useMemo(
    () =>
      schemaData.properties && Object.keys(schemaData.properties).length !== 0,
    [schemaData.properties],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (allows clicks)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      handleDndDragEnd(event, {
        schema,
        uischema,
        onChange,
        definitionData,
        definitionUi,
        categoryHash,
      });
    },
    [schema, uischema, onChange, definitionData, definitionUi, categoryHash],
  );

  const sectionElements = useMemo(() => {
    const elements = generateElementComponentsFromSchemas({
      schemaData: schema,
      uiSchemaData: uischema,
      onChange,
      path,
      definitionData,
      definitionUi,
      cardOpenArray,
      setCardOpenArray,
      allFormInputs,
      mods,
      categoryHash,
      Card,
      Section,
    });
    const itemIds = elements.map((element: any) => element.key);
    return { elements, itemIds };
  }, [
    schema,
    uischema,
    onChange,
    path,
    definitionData,
    definitionUi,
    cardOpenArray,
    allFormInputs,
    mods,
    categoryHash,
  ]);

  const handleToggleCollapse = useCallback(() => {
    setCardOpen(!cardOpen);
  }, [cardOpen]);

  const handleModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

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

  const handleKeyNameChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setKeyName(ev.target.value);
    },
    [],
  );

  const handleKeyNameBlur = useCallback(
    (ev: React.FocusEvent<HTMLInputElement>) => {
      const { value } = ev.target;
      if (value === name || !(neighborNames && neighborNames.includes(value))) {
        setKeyError(null);
        onNameChange(value);
      } else {
        setKeyName(name);
        setKeyError(`"${value}" is already in use.`);
        onNameChange(name);
      }
    },
    [name, neighborNames, onNameChange],
  );

  const handleTitleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      onChange(
        {
          ...schema,
          title: ev.target.value,
        },
        uischema,
      );
    },
    [onChange, schema, uischema],
  );

  const handleDescriptionChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      onChange(
        {
          ...schema,
          description: ev.target.value,
        },
        uischema,
      );
    },
    [onChange, schema, uischema],
  );

  const handleReferenceChange = useCallback(
    (_: unknown, val: { value: string; label: string } | null) => {
      if (val) onChange(schema, uischema, val.value);
    },
    [onChange, schema, uischema],
  );

  const handleModalSave = useCallback(
    (newComponentProps: { [key: string]: any }) => {
      onDependentsChange(newComponentProps.dependents);
      onChange(schema, {
        ...uischema,
        'ui:column': newComponentProps['ui:column'],
      });
    },
    [onChange, onDependentsChange, schema, uischema],
  );

  const handleAddElem = useCallback(
    (choice: string) => {
      if (choice === 'card') {
        addCardObj(addProperties);
      } else if (choice === 'section') {
        addSectionObj(addProperties);
      }
    },
    [addProperties],
  );

  const handleParentAddElem = useCallback(
    (choice: string) => {
      if (choice === 'card') {
        addCardObj(parentProperties);
      } else if (choice === 'section') {
        addSectionObj(parentProperties);
      }
      setCardOpen(false);
    },
    [parentProperties],
  );

  const referenceOptions = useMemo(
    () =>
      Object.keys(definitionData).map((key) => ({
        value: `#/definitions/${key}`,
        label: `#/definitions/${key}`,
      })),
    [definitionData],
  );

  const referenceValue = useMemo(
    () => (reference ? { value: reference, label: reference } : undefined),
    [reference],
  );

  const modalComponentProps = useMemo(
    () => ({
      dependents,
      neighborNames,
      name: keyName,
      schema,
      type: 'object' as const,
      'ui:column': (uischema['ui:column'] as string | undefined) ?? '',
      'ui:options':
        (uischema['ui:options'] as Record<string, unknown> | undefined) ??
        ({} as Record<string, unknown>),
    }),
    [dependents, neighborNames, keyName, schema, uischema],
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
              {((schemaData as JsonSchema).title as string | undefined) ||
                keyName}{' '}
              {parent && (
                <TooltipComponent text={`Depends on ${parent}`} type='alert' />
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
        data-testid='section-container'
      >
        <Stack
          spacing={2}
          sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2 }}
        >
          {reference && (
            <Box data-testid='section-reference'>
              <Typography variant='subtitle2' fontWeight='bold'>
                Reference Section
              </Typography>
              <Autocomplete
                value={referenceValue}
                options={referenceOptions}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onChange={handleReferenceChange}
                size='small'
                disableClearable
                renderInput={(params) => (
                  <TextField {...params} placeholder='Reference' />
                )}
                sx={{ mt: 0.5 }}
              />
            </Box>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }} data-testid='section-object-name'>
              <Typography
                variant='subtitle2'
                fontWeight='bold'
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                Section Object Name{' '}
                <TooltipComponent
                  text={
                    mods?.tooltipDescriptions?.cardSectionObjectName ??
                    'The key to the object that will represent this form section.'
                  }
                  type='help'
                />
              </Typography>
              <FormControl fullWidth error={keyError !== null} sx={{ mt: 0.5 }}>
                <TextField
                  error={keyError !== null}
                  value={keyName || ''}
                  placeholder='Key'
                  type='text'
                  onChange={handleKeyNameChange}
                  onBlur={handleKeyNameBlur}
                  size='small'
                  fullWidth
                  disabled={hideKey}
                  slotProps={{ input: { className: 'card-text' } }}
                />
                {keyError && <FormHelperText>{keyError}</FormHelperText>}
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }} data-testid='section-display-name'>
              <Typography
                variant='subtitle2'
                fontWeight='bold'
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                Section Display Name{' '}
                <TooltipComponent
                  text={
                    mods?.tooltipDescriptions?.cardSectionDisplayName ??
                    'The name of the form section that will be shown to users of the form.'
                  }
                  type='help'
                />
              </Typography>
              <TextField
                value={schemaData.title || ''}
                placeholder='Title'
                type='text'
                onChange={handleTitleChange}
                size='small'
                fullWidth
                sx={{ mt: 0.5 }}
                slotProps={{ input: { className: 'card-text' } }}
              />
            </Box>
            <Box sx={{ flex: 1 }} data-testid='section-description'>
              <Typography
                variant='subtitle2'
                fontWeight='bold'
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                Section Description{' '}
                <TooltipComponent
                  text={
                    mods?.tooltipDescriptions?.cardSectionDescription ??
                    'A description of the section which will be visible on the form.'
                  }
                  type='help'
                />
              </Typography>
              <TextField
                value={schemaData.description || ''}
                placeholder='Description'
                type='text'
                onChange={handleDescriptionChange}
                size='small'
                fullWidth
                sx={{ mt: 0.5 }}
                slotProps={{ input: { className: 'card-text' } }}
              />
            </Box>
          </Stack>
          {unsupportedFeatures.length > 0 && (
            <Alert severity='warning'>
              <AlertTitle>Unsupported Features</AlertTitle>
              <Box component='ul' sx={{ margin: 0, pl: 2.5 }}>
                {unsupportedFeatures.map((message) => (
                  <Box component='li' key={message}>
                    {message}
                  </Box>
                ))}
              </Box>
            </Alert>
          )}
        </Stack>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionElements.itemIds}
            strategy={verticalListSortingStrategy}
          >
            {sectionElements.elements.map((element: any) => (
              <SortableItem key={element.key} id={element.key}>
                {element}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {!hideAddButton &&
            mods?.components?.add &&
            mods.components.add(addProperties)}
          {!mods?.components?.add && (
            <Add
              tooltipDescription={
                ((mods || {}).tooltipDescriptions || {}).add as
                  | string
                  | undefined
              }
              addElem={handleAddElem}
              hidden={hideAddButton as boolean}
            />
          )}
        </Box>
        <Stack
          direction='row'
          spacing={2}
          alignItems='center'
          sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }}
        >
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
              onChangeValue={onRequireToggle}
              isChecked={required}
              label='Required'
            />
          </Box>
        </Stack>
        <CardModal
          componentProps={modalComponentProps}
          isOpen={modalOpen}
          onClose={handleModalClose}
          onChange={handleModalSave}
          TypeSpecificParameters={CardDefaultParameterInputs}
        />
      </Collapse>
      {mods?.components?.add && mods.components.add(parentProperties)}
      {!mods?.components?.add && (
        <Add
          tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
          addElem={handleParentAddElem}
        />
      )}
    </>
  );
}

export default memo(Section);
