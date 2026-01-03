import React, {
  ReactElement,
  memo,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import Box from '@mui/material/Box';
import CardGallery from './CardGallery';
import {
  parse,
  stringify,
  propagateDefinitionChanges,
  generateCategoryHash,
  excludeKeys,
} from './utils';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';
import type { Mods } from './types';

function PredefinedGallery({
  schema,
  uischema,
  onChange,
  mods,
  className,
}: {
  schema: string;
  uischema: string;
  onChange: (schema: string, uischema: string) => any;
  mods?: Mods;
  className?: string;
}): ReactElement {
  const schemaData = useMemo(() => parse(schema) || {}, [schema]);
  const uiSchemaData = useMemo(() => parse(uischema) || {}, [uischema]);

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

  const categoryHash = useMemo(
    () => generateCategoryHash(allFormInputs),
    [allFormInputs],
  );

  useEffect(() => {
    if (!uiSchemaData.definitions) {
      console.log('Parsing UI schema to assign UI for definitions');
      // need to create definitions from scratch
      const references: string[] = [];
      // recursively search for all $refs in the schemaData
      const findRefs = (name: string, schemaObject: { [key: string]: any }) => {
        if (!schemaObject) return;
        if (typeof schemaObject === 'object')
          Object.keys(schemaObject).forEach((key) => {
            if (typeof key === 'string') {
              if (key === '$ref') references.push(name);
              findRefs(key, schemaObject[key]);
            }
          });
        if (Array.isArray(schemaObject))
          schemaObject.forEach((innerObj) => {
            findRefs(name, innerObj);
          });
      };

      findRefs('root', schemaData);

      // Build definitions immutably
      const referenceSet = new Set(references);
      const newDefinitions: { [key: string]: any } = {};
      Object.keys(uiSchemaData).forEach((uiProp) => {
        if (referenceSet.has(uiProp)) {
          newDefinitions[uiProp] = uiSchemaData[uiProp];
        }
      });

      const updatedUiSchemaData = {
        ...uiSchemaData,
        definitions: Object.keys(newDefinitions).length
          ? newDefinitions
          : undefined,
      };
      onChange(stringify(schemaData), stringify(updatedUiSchemaData));
    }
  }, [uiSchemaData, schemaData, onChange]);

  const handleGalleryChange = useCallback(
    (
      newDefinitions: { [key: string]: any },
      newDefinitionsUi: { [key: string]: any },
    ) => {
      // propagate changes in ui definitions to all relavant parties in main schema
      propagateDefinitionChanges(
        { ...schemaData, definitions: newDefinitions },
        { ...uiSchemaData, definitions: newDefinitionsUi },
        (newSchema, newUiSchema) =>
          onChange(stringify(newSchema), stringify(newUiSchema)),
        categoryHash,
      );
    },
    [schemaData, uiSchemaData, onChange, categoryHash],
  );

  return (
    <Box className={className || ''}>
      <CardGallery
        definitionSchema={schemaData.definitions || {}}
        definitionUiSchema={uiSchemaData.definitions || {}}
        onChange={handleGalleryChange}
        mods={mods}
        categoryHash={categoryHash}
      />
    </Box>
  );
}

export default memo(PredefinedGallery);
