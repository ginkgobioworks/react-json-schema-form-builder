import React, {
  ReactElement,
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
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
import AlertTitle from '@mui/material/AlertTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from './Card';
import Section from './Section';
import Add from './Add';
import {
  parse,
  stringify,
  checkForUnsupportedFeatures,
  generateElementComponentsFromSchemas,
  addCardObj,
  addSectionObj,
  handleDndDragEnd,
  countElementsFromSchema,
  generateCategoryHash,
  excludeKeys,
} from './utils';
import SortableItem from './SortableItem';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import type {
  Mods,
  InitParameters,
  AddFormObjectParameters,
  JsonSchema,
  UiSchema,
  DefinitionData,
  UiSchemaProperty,
} from './types';

function FormBuilder({
  schema,
  uischema,
  onMount,
  onChange,
  mods,
  className,
}: {
  schema: string;
  uischema: string;
  onMount?: (parameters: InitParameters) => any;
  onChange: (schema: string, uischema: string) => any;
  mods?: Mods;
  className?: string;
}): ReactElement {
  // Parse schema and ensure it has type: 'object' (immutably)
  const schemaData = useMemo(() => {
    const parsed = parse(schema) as JsonSchema;
    return { ...parsed, type: 'object' as const };
  }, [schema]);

  const uiSchemaData = useMemo(() => parse(uischema) as UiSchema, [uischema]);

  const allFormInputs = useMemo(
    () =>
      excludeKeys(
        Object.assign(
          {},
          DEFAULT_FORM_INPUTS,
          (mods && mods.customFormInputs) || {},
        ),
        mods && mods.deactivatedFormInputs,
      ),
    [mods],
  );

  const unsupportedFeatures = useMemo(
    () => checkForUnsupportedFeatures(schemaData, uiSchemaData, allFormInputs),
    [schemaData, uiSchemaData, allFormInputs],
  );

  const elementNum = countElementsFromSchema(schemaData);
  const defaultCollapseStates = useMemo(
    () => [...Array(elementNum)].map(() => false),
    [elementNum],
  );
  const [cardOpenArray, setCardOpenArray] = useState(defaultCollapseStates);

  // useState setter is already stable and functional updates automatically use latest state

  const categoryHash = useMemo(
    () => generateCategoryHash(allFormInputs),
    [allFormInputs],
  );

  const [isFirstRender, setIsFirstRender] = useState(true);

  // Memoized onChange handler for schema changes
  const handleSchemaChange = useCallback(
    (
      newSchema: { [key: string]: any },
      newUiSchema: { [key: string]: any },
    ) => {
      onChange(stringify(newSchema), stringify(newUiSchema));
    },
    [onChange],
  );

  // Memoized onChange handler for element components to avoid recreating on every render
  const handleElementChange = useCallback(
    (
      newSchema: { [key: string]: any },
      newUiSchema: { [key: string]: any },
    ) => {
      onChange(stringify(newSchema), stringify(newUiSchema));
    },
    [onChange],
  );

  const addProperties = useMemo<AddFormObjectParameters>(
    () => ({
      schema: schemaData as JsonSchema,
      uischema: uiSchemaData as UiSchema,
      mods,
      onChange: handleSchemaChange,
      definitionData: (schemaData.definitions || {}) as DefinitionData,
      definitionUi: (uiSchemaData.definitions || {}) as Record<
        string,
        UiSchemaProperty
      >,
      categoryHash,
    }),
    [schemaData, uiSchemaData, mods, handleSchemaChange, categoryHash],
  );

  const hideAddButton = useMemo(
    () =>
      schemaData.properties && Object.keys(schemaData.properties).length !== 0,
    [schemaData],
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
        schema: schemaData,
        uischema: uiSchemaData,
        onChange: handleSchemaChange,
        definitionData: schemaData.definitions,
        definitionUi: uiSchemaData.definitions,
        categoryHash,
      });
    },
    [schemaData, uiSchemaData, handleSchemaChange, categoryHash],
  );

  useEffect(() => {
    if (isFirstRender) {
      if (onMount)
        onMount({
          categoryHash,
        });
      setIsFirstRender(false);
    }
  }, [isFirstRender, onMount, categoryHash]);

  const formElements = useMemo(() => {
    const elements = generateElementComponentsFromSchemas({
      schemaData,
      uiSchemaData,
      onChange: handleElementChange,
      definitionData: schemaData.definitions,
      definitionUi: uiSchemaData.definitions,
      path: 'root',
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
    schemaData,
    uiSchemaData,
    handleElementChange,
    cardOpenArray,
    allFormInputs,
    mods,
    categoryHash,
  ]);

  return (
    <Box className={className || ''}>
      {unsupportedFeatures.length > 0 && (
        <Alert
          severity='warning'
          className='alert-warning'
          sx={{ mb: 2, mx: 'auto', maxWidth: 800 }}
        >
          <AlertTitle>Unsupported Features</AlertTitle>
          <Box component='ul' sx={{ margin: 0, pl: 2.5 }}>
            {unsupportedFeatures.map((message, index) => (
              <Box component='li' key={index}>
                {message}
              </Box>
            ))}
          </Box>
        </Alert>
      )}
      {(!mods || mods.showFormHead !== false) && (
        <Paper
          variant='outlined'
          data-testid='form-head'
          sx={{
            p: 2,
            mb: 3,
            mx: 'auto',
            maxWidth: 800,
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant='subtitle2'
                component='label'
                fontWeight='bold'
                data-testid='form-name-label'
              >
                {mods?.labels?.formNameLabel ?? 'Form Name'}
              </Typography>
              <TextField
                value={(schemaData as JsonSchema).title || ''}
                placeholder='Title'
                type='text'
                onChange={(ev) => {
                  onChange(
                    stringify({
                      ...schemaData,
                      title: ev.target.value,
                    }),
                    uischema,
                  );
                }}
                size='small'
                fullWidth
                sx={{ mt: 0.5 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant='subtitle2'
                component='label'
                fontWeight='bold'
                data-testid='form-description-label'
              >
                {mods?.labels?.formDescriptionLabel ?? 'Form Description'}
              </Typography>
              <TextField
                value={(schemaData as JsonSchema).description || ''}
                placeholder='Description'
                type='text'
                onChange={(ev) =>
                  onChange(
                    stringify({
                      ...schemaData,
                      description: ev.target.value,
                    }),
                    uischema,
                  )
                }
                size='small'
                fullWidth
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>
        </Paper>
      )}
      <Stack
        spacing={2}
        data-testid='form-body'
        sx={{ mx: 'auto', maxWidth: 800 }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={formElements.itemIds}
            strategy={verticalListSortingStrategy}
          >
            {formElements.elements.map((element: any) => (
              <SortableItem key={element.key} id={element.key}>
                {element}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </Stack>
      <Box className='form-footer' sx={{ mt: 2, textAlign: 'center' }}>
        {!hideAddButton &&
          mods?.components?.add &&
          mods.components.add(addProperties)}
        {!mods?.components?.add && (
          <Add
            tooltipDescription={((mods || {}).tooltipDescriptions || {}).add}
            labels={mods?.labels ?? {}}
            addElem={(choice: string) => {
              if (choice === 'card') {
                addCardObj(addProperties);
              } else if (choice === 'section') {
                addSectionObj(addProperties);
              }
            }}
            hidden={hideAddButton}
          />
        )}
      </Box>
    </Box>
  );
}

export default memo(FormBuilder);
