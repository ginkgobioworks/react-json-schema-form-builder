import React, { ReactNode } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Typography from '@mui/material/Typography';
import {
  Section,
  Card,
  CardProps,
  ElementProps,
  FormInput,
  Mods,
  CardComponent,
  DataOptions,
  DataType,
  FormElement,
  CardComponentProps,
  AddFormObjectParameters,
  DefinitionData,
  InputSelectData,
  JsonSchema,
  JsonSchemaProperty,
  UiSchema,
  UiSchemaProperty,
} from './types';

export function parse(text: string): Record<string, unknown> {
  if (!text || text.trim() === '') return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export function stringify(obj: unknown): string {
  if (!obj) return '{}';
  try {
    return JSON.stringify(obj);
  } catch (error) {
    throw new Error(
      `Failed to stringify object: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export function defaultDataProps(
  category: string,
  allFormInputs: { [key: string]: FormInput },
): InputSelectData {
  return allFormInputs[category]
    .defaultDataSchema as unknown as InputSelectData;
}

export function defaultUiProps(
  category: string,
  allFormInputs: { [key: string]: FormInput },
): InputSelectData {
  return allFormInputs[category].defaultUiSchema as unknown as InputSelectData;
}
export function categoryType(
  category: string,
  allFormInputs: { [key: string]: FormInput },
): DataType {
  return allFormInputs[category].type;
}
export function getCardBody(
  category: string,
  allFormInputs: { [key: string]: FormInput },
) {
  return (
    (allFormInputs[category] && allFormInputs[category].cardBody) ||
    (() => null)
  );
}

export function categoryToNameMap(allFormInputs: {
  [key: string]: FormInput;
}): Record<string, string> {
  const categoryNameMap: Record<string, string> = {};
  Object.keys(allFormInputs).forEach((inputName) => {
    categoryNameMap[inputName] = allFormInputs[inputName].displayName;
  });
  return categoryNameMap;
}

function updateElementNames(elementArray: Array<ElementProps>) {
  const elementNames = elementArray.map((elem) => elem.name);
  return elementArray.map((elem) => {
    const newElem = elem;
    newElem.neighborNames = elementNames;
    return newElem;
  });
}

export function generateCategoryHash(allFormInputs: {
  [key: string]: FormInput;
}): Record<string, string> {
  const categoryHash: Record<string, string> = {};
  Object.keys(allFormInputs).forEach((categoryName) => {
    const formInput = allFormInputs[categoryName];
    formInput.matchIf.forEach((match) => {
      match.types.forEach((type) => {
        const hash = `type:${type === 'null' ? '' : type};widget:${
          match.widget || ''
        };field:${match.field || ''};format:${match.format || ''};$ref:${
          match.$ref ? 'true' : 'false'
        };enum:${match.enum ? 'true' : 'false'}`;
        if (categoryHash[hash]) {
          throw new Error(`Duplicate hash: ${hash}`);
        }
        categoryHash[hash] = categoryName;
      });
    });
  });
  return categoryHash;
}

// determines a card's category based on it's properties
// mostly useful for reading a schema for the first time
export function getCardCategory(
  cardProps: CardProps,
  categoryHash: { [key: string]: string },
): string {
  const currentHash = `type:${cardProps.dataOptions.type || ''};widget:${
    cardProps.uiOptions['ui:widget'] || ''
  };field:${cardProps.uiOptions['ui:field'] || ''};format:${
    cardProps.dataOptions.format || ''
  };$ref:${cardProps.$ref !== undefined ? 'true' : 'false'};enum:${
    cardProps.dataOptions.enum ? 'true' : 'false'
  }`;
  const category = categoryHash[currentHash];
  if (!category) {
    if (cardProps.$ref) return 'ref';

    console.error(`No match for card': ${currentHash} among set`);
    return 'shortAnswer';
  }
  return category;
}

// check for unsupported feature in schema and uischema
const supportedPropertyParameters = new Set([
  'title',
  'description',
  'enum',
  'minLength',
  'maxLength',
  'multipleOf',
  'minimum',
  'maximum',
  'format',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'type',
  'default',
  'pattern',
  'required',
  'properties',
  'items',
  'definitions',
  '$ref',
  'minItems',
  'maxItems',
  'enumNames',
  'dependencies',
  '$id',
  '$schema',
  'meta',
  'additionalProperties',
]);

const supportedUiParameters = new Set([
  'ui:order',
  'ui:widget',
  'ui:autofocus',
  'ui:autocomplete',
  'ui:options',
  'ui:field',
  'ui:placeholder',
  'ui:column',
  'items',
  'definitions',
]);

// recursively called function to check an object for unsupported features
function checkObjectForUnsupportedFeatures(
  schema: JsonSchemaProperty | Record<string, unknown>,
  uischema: UiSchemaProperty | Record<string, unknown>,
  supportedWidgets: Set<string>,
  supportedFields: Set<string>,
  supportedOptions: Set<string>,
): string[] {
  // add each unsupported feature to this array
  const unsupportedFeatures: Array<string> = [];

  // check for unsupported whole object features
  if (schema && typeof schema === 'object') {
    Object.keys(schema).forEach((property) => {
      if (
        !supportedPropertyParameters.has(property) &&
        property !== 'properties'
      ) {
        unsupportedFeatures.push(`Unrecognized Object Property: ${property}`);
      }
    });
  }

  if (uischema && typeof uischema === 'object') {
    Object.keys(uischema).forEach((uiProperty) => {
      let propDefined = false;
      // search for the property in the schema properties and dependencies
      if (
        schema.properties &&
        Object.keys(schema.properties).includes(uiProperty)
      ) {
        propDefined = true;
      }
      if (schema.dependencies) {
        const deps = schema.dependencies as Record<
          string,
          {
            oneOf?: Array<{ properties?: Record<string, unknown> }>;
            properties?: Record<string, unknown>;
          }
        >;
        Object.keys(deps).forEach((dependencyKey) => {
          Object.keys(deps[dependencyKey]).forEach((parameter) => {
            if (parameter === 'oneOf') {
              deps[dependencyKey].oneOf?.forEach((grouping) => {
                if (grouping.properties) {
                  if (Object.keys(grouping.properties).includes(uiProperty)) {
                    propDefined = true;
                  }
                }
              });
            } else if (parameter === 'properties') {
              if (
                deps[dependencyKey].properties &&
                Object.keys(deps[dependencyKey].properties!).includes(
                  uiProperty,
                )
              ) {
                propDefined = true;
              }
            }
          });
        });
      }

      if (!propDefined && !supportedUiParameters.has(uiProperty)) {
        unsupportedFeatures.push(
          `Unrecognized UI schema property: ${uiProperty}`,
        );
      }
    });
  }

  // check for unsupported property parameters
  if (schema.properties) {
    Object.entries(schema.properties).forEach(
      ([parameter, element]: [string, any]) => {
        if (
          element &&
          typeof element === 'object' &&
          element.type &&
          element.type !== 'object'
        ) {
          // make sure that the type is valid
          if (
            !['array', 'string', 'integer', 'number', 'boolean'].includes(
              element.type,
            )
          ) {
            unsupportedFeatures.push(
              `Unrecognized type: ${element.type} in ${parameter}`,
            );
          }
          // check the properties of each property if it is a basic object
          Object.keys(element).forEach((key) => {
            if (!supportedPropertyParameters.has(key)) {
              unsupportedFeatures.push(
                `Property Parameter: ${key} in ${parameter}`,
              );
            }
          });
        } else {
          // check the properties of each property if it is a basic object
          Object.keys(element).forEach((key) => {
            if (!supportedPropertyParameters.has(key)) {
              unsupportedFeatures.push(
                `Property Parameter: ${key} in ${parameter}`,
              );
            }
          });
        }

        // check for unsupported UI components
        // Skip this check for object types and $ref elements (which may reference objects)
        const isObjectLike =
          element &&
          (element.type === 'object' || element.$ref || element.properties);
        if (uischema && uischema[parameter] && element && !isObjectLike) {
          // check for unsupported ui properties
          Object.keys(uischema[parameter]).forEach((uiProp) => {
            if (!supportedUiParameters.has(uiProp)) {
              unsupportedFeatures.push(
                `UI Property: ${uiProp} for ${parameter}`,
              );
            }

            // check for unsupported ui widgets
            const uiParam = uischema[parameter] as Record<string, unknown>;
            if (
              uiProp === 'ui:widget' &&
              typeof uiParam[uiProp] === 'string' &&
              !supportedWidgets.has(uiParam[uiProp] as string)
            ) {
              unsupportedFeatures.push(
                `UI Widget: ${uiParam[uiProp]} for ${parameter}`,
              );
            }

            // check for unsupported ui fields
            if (
              uiProp === 'ui:field' &&
              typeof uiParam[uiProp] === 'string' &&
              !supportedFields.has(uiParam[uiProp] as string)
            ) {
              unsupportedFeatures.push(
                `UI Field: ${uiParam[uiProp]} for ${parameter}`,
              );
            }

            // check unsupported ui option
            if (
              uiProp === 'ui:options' &&
              typeof uiParam['ui:options'] === 'object' &&
              uiParam['ui:options'] !== null
            ) {
              Object.keys(
                uiParam['ui:options'] as Record<string, unknown>,
              ).forEach((uiOption) => {
                if (!supportedOptions.has(uiOption)) {
                  unsupportedFeatures.push(
                    `UI Property: ui:options.${uiOption} for ${parameter}`,
                  );
                }
              });
            }
          });
        }
      },
    );
  }

  return unsupportedFeatures;
}

// parent function that checks for unsupported features in an entire document
export function checkForUnsupportedFeatures(
  schema: JsonSchema | Record<string, unknown>,
  uischema: UiSchema | Record<string, unknown>,
  allFormInputs: { [key: string]: FormInput },
): string[] {
  // add each unsupported feature to this array
  const unsupportedFeatures = [];

  const widgets: string[] = [];
  const fields: string[] = [];
  const options: string[] = [];
  Object.keys(allFormInputs).forEach((inputType) => {
    allFormInputs[inputType].matchIf.forEach((match) => {
      if (match.widget && !widgets.includes(match.widget)) {
        widgets.push(match.widget);
      }
      if (match.field && !fields.includes(match.field)) {
        fields.push(match.field);
      }
    });
    if (
      allFormInputs[inputType].possibleOptions &&
      Array.isArray(allFormInputs[inputType].possibleOptions)
    ) {
      options.push(...allFormInputs[inputType].possibleOptions!);
    }
  });
  const supportedWidgets = new Set(widgets);
  const supportedFields = new Set(fields);
  const supportedOptions = new Set(options);

  // check for unsupported whole form features
  if (schema && typeof schema === 'object' && schema.type === 'object') {
    unsupportedFeatures.push(
      ...checkObjectForUnsupportedFeatures(
        schema,
        uischema,
        supportedWidgets,
        supportedFields,
        supportedOptions,
      ),
    );
  } else {
    unsupportedFeatures.push('jsonSchema form is not of type object');
  }

  return unsupportedFeatures;
}

// make an element out of the corresponding properties and UI properties
function generateDependencyElement(
  name: string,
  dataProps: JsonSchemaProperty | Record<string, unknown>,
  uiProperties: UiSchemaProperty | Record<string, unknown>,
  requiredNames: string[],
  categoryHash: { [key: string]: string },
  definitionData?: DefinitionData,
  definitionUi?: { [key: string]: UiSchemaProperty },
  useDefinitionDetails = true, // determines whether to use an element's definition details or not.
): FormElement {
  let uiProps = {
    ...uiProperties,
  };
  const newElement: FormElement = {};
  let elementDetails =
    dataProps && typeof dataProps === 'object' ? dataProps : {};

  // populate newElement with reference if applicable
  if (elementDetails.$ref !== undefined && definitionData) {
    const pathArr =
      typeof elementDetails.$ref === 'string'
        ? elementDetails.$ref.split('/')
        : [];
    if (
      pathArr[0] === '#' &&
      pathArr[1] === 'definitions' &&
      definitionData[pathArr[2]] &&
      useDefinitionDetails === true
    ) {
      elementDetails = {
        ...elementDetails,
        ...definitionData[pathArr[2]],
      };
    }

    const definedUiProps = (definitionUi || {})[pathArr[2]];
    uiProps = {
      ...(definedUiProps || {}),
      ...uiProps,
    };
  }

  newElement.name = name;
  newElement.required = requiredNames.includes(name);
  newElement.$ref =
    typeof elementDetails.$ref === 'string' ? elementDetails.$ref : undefined;

  if (elementDetails.type && elementDetails.type === 'object') {
    // create a section
    newElement.schema = elementDetails;
    newElement.uischema = uiProps || {};
    newElement.propType = 'section';
  } else {
    // create a card
    newElement.dataOptions = elementDetails;
    newElement.uiOptions = uiProps || {};

    // ensure that uiOptions does not have duplicate keys with dataOptions
    const reservedKeys = Object.keys(newElement.dataOptions!);
    Object.keys(newElement.uiOptions!).forEach((uiKey) => {
      if (reservedKeys.includes(uiKey)) {
        newElement.uiOptions![`ui:*${uiKey}`] = newElement.uiOptions![uiKey];
      }
    });

    (newElement.dataOptions as Record<string, unknown>).category =
      getCardCategory(newElement as CardProps, categoryHash);
    newElement.propType = 'card';
  }
  return newElement;
}

// generate an array of element objects from a schema and uischema
export function generateElementPropsFromSchemas(parameters: {
  schema: JsonSchema | Record<string, unknown>;
  uischema: UiSchema | Record<string, unknown>;
  definitionData?: DefinitionData;
  definitionUi?: { [key: string]: UiSchemaProperty };
  categoryHash: { [key: string]: string };
}): ElementProps[] {
  const { schema, uischema, definitionData, definitionUi, categoryHash } =
    parameters;

  if (!schema.properties) return [];

  const elementDict: { [key: string]: FormElement } = {};
  const requiredNames =
    'required' in schema && Array.isArray(schema.required)
      ? schema.required
      : [];

  // read regular elements from properties
  if (!schema.properties || typeof schema.properties !== 'object') {
    return [];
  }

  Object.entries(schema.properties).forEach(([parameter, element]) => {
    const newElement: FormElement = {};
    let elementDetails: JsonSchemaProperty | Record<string, unknown> =
      element && typeof element === 'object' && !Array.isArray(element)
        ? (element as JsonSchemaProperty)
        : {};

    // populate newElement with reference if applicable
    if (
      '$ref' in elementDetails &&
      elementDetails.$ref !== undefined &&
      definitionData
    ) {
      const refValue =
        typeof elementDetails.$ref === 'string'
          ? elementDetails.$ref
          : String(elementDetails.$ref);
      if (refValue && !refValue.startsWith('#/definitions')) {
        throw new Error(
          `Invalid definition, not at '#/definitions': ${refValue}`,
        );
      }
      const pathArr = refValue ? refValue.split('/') : [];
      if (
        pathArr[0] === '#' &&
        pathArr[1] === 'definitions' &&
        pathArr[2] &&
        definitionData[pathArr[2]]
      ) {
        elementDetails = {
          ...(definitionData[pathArr[2]] as JsonSchemaProperty),
          ...elementDetails,
        };
      }

      const definedUiProps = definitionUi?.[pathArr[2] || ''];
      if (typeof uischema === 'object' && uischema !== null) {
        (uischema as Record<string, unknown>)[parameter] = {
          ...(definedUiProps || {}),
          ...((uischema as Record<string, unknown>)[parameter] || {}),
        };
      }
    }
    newElement.name = parameter;
    newElement.required = requiredNames.includes(parameter);
    newElement.$ref =
      '$ref' in elementDetails && typeof elementDetails.$ref === 'string'
        ? elementDetails.$ref
        : undefined;
    newElement.dataOptions = elementDetails as Record<string, unknown>;

    if ('type' in elementDetails && elementDetails.type === 'object') {
      // create a section
      newElement.schema = elementDetails as Record<string, unknown>;
      newElement.uischema = (
        typeof uischema === 'object' &&
        uischema !== null &&
        parameter in uischema &&
        typeof (uischema as Record<string, unknown>)[parameter] === 'object'
          ? (uischema as Record<string, unknown>)[parameter]
          : {}
      ) as Record<string, unknown>;
      newElement.propType = 'section';
    } else {
      // create a card
      newElement.uiOptions = (
        typeof uischema === 'object' &&
        uischema !== null &&
        parameter in uischema &&
        typeof (uischema as Record<string, unknown>)[parameter] === 'object'
          ? (uischema as Record<string, unknown>)[parameter]
          : {}
      ) as Record<string, unknown>;

      // ensure that uiOptions does not have duplicate keys with dataOptions
      const reservedKeys = Object.keys(newElement.dataOptions || {});
      const uiOptions = newElement.uiOptions || {};
      Object.keys(uiOptions).forEach((uiKey) => {
        if (reservedKeys.includes(uiKey)) {
          (uiOptions as Record<string, unknown>)[`ui:*${uiKey}`] =
            uiOptions[uiKey];
          delete (uiOptions as Record<string, unknown>)[uiKey];
        }
      });
      newElement.uiOptions = uiOptions;

      (newElement.dataOptions as Record<string, unknown>).category =
        getCardCategory(newElement as CardProps, categoryHash);
      newElement.propType = 'card';
    }
    elementDict[newElement.name!] = newElement;
  });
  // read dependent elements from dependencies
  if (schema.dependencies) {
    const useDefinitionDetails = false;
    const deps = schema.dependencies as Record<
      string,
      {
        oneOf?: Array<{
          properties?: Record<string, JsonSchemaProperty>;
          required?: string[];
        }>;
      }
    >;
    Object.keys(deps).forEach((parent) => {
      const group = deps[parent];
      if (group.oneOf) {
        let possibilityIndex = 0;
        group.oneOf.forEach((possibility) => {
          if (!(elementDict[parent] || {}).dependents) {
            elementDict[parent] = elementDict[parent] || {};
            elementDict[parent].dependents = [];
          }
          elementDict[parent].dependents!.push({
            children: [],
            value: possibility.properties?.[parent] as unknown,
          });
          const requiredValues = possibility.required || [];
          Object.entries(possibility.properties || {}).forEach(
            ([parameter, element]) => {
              // create a new element if not present in main properties
              if (
                !elementDict[parameter] ||
                (parameter !== parent &&
                  Object.keys(elementDict[parameter]).length === 1 &&
                  elementDict[parameter].dependents)
              ) {
                const uiProp =
                  typeof uischema === 'object' &&
                  uischema !== null &&
                  parameter in uischema
                    ? (uischema as Record<string, unknown>)[parameter]
                    : {};
                const newElement = generateDependencyElement(
                  parameter,
                  element,
                  uiProp as UiSchemaProperty,
                  requiredNames,
                  categoryHash,
                  definitionData,
                  definitionUi,
                  useDefinitionDetails,
                );
                if (
                  elementDict[parameter] &&
                  elementDict[parameter].dependents
                ) {
                  newElement.dependents = elementDict[parameter].dependents;
                }
                newElement.required = requiredValues.includes(
                  newElement.name || '',
                );
                elementDict[newElement.name!] = newElement;
              }
              if (parameter !== parent) {
                const newElement = elementDict[parameter];
                newElement.dependent = true;
                newElement.parent = parent;
                if (elementDict[parent].dependents) {
                  (
                    elementDict[parent].dependents as Array<{
                      children: string[];
                      value?: unknown;
                    }>
                  )[possibilityIndex].children.push(parameter);
                }
              }
            },
          );
          possibilityIndex += 1;
        });
      } else if (
        'properties' in group &&
        group.properties &&
        typeof group.properties === 'object'
      ) {
        const groupProps = group as {
          properties: Record<string, unknown>;
          required?: string[];
        };
        const requiredValues = groupProps.required || [];
        Object.entries(groupProps.properties).forEach(
          ([parameter, element]) => {
            const uiProp =
              typeof uischema === 'object' &&
              uischema !== null &&
              parameter in uischema
                ? (uischema as Record<string, unknown>)[parameter]
                : {};
            const newElement = generateDependencyElement(
              parameter,
              element as JsonSchemaProperty,
              uiProp as UiSchemaProperty,
              requiredNames,
              categoryHash,
              definitionData,
              definitionUi,
              useDefinitionDetails,
            );
            newElement.required = requiredValues.includes(
              newElement.name || '',
            );
            newElement.dependent = true;
            newElement.parent = parent;
            elementDict[newElement.name!] = newElement;
            if (elementDict[parent]) {
              if (elementDict[parent].dependents) {
                elementDict[parent].dependents[0].children.push(parameter);
              } else {
                elementDict[parent].dependents = [{ children: [parameter] }];
              }
            } else {
              elementDict[parent] = {};
              elementDict[parent].dependents = [{ children: [parameter] }];
            }
          },
        );
      } else {
        console.error('unsupported dependency type encountered');
      }
    });
  }

  // now reorder in accordance with ui:order if defined
  const cardPropList: FormElement[] = [];
  const uiOrder = uischema['ui:order'];
  if (uiOrder && Array.isArray(uiOrder)) {
    // in case there are any options not in ui:order
    const remainder: FormElement[] = [];
    Object.keys(elementDict).forEach((name) => {
      if (!uiOrder.includes(name)) remainder.push(elementDict[name]);
    });

    // map ui order elements into the right order
    uiOrder.forEach((name: string) => {
      // if contains the wildcard *, insert remainder cards there
      if (name === '*') {
        remainder.forEach((remCard) => {
          cardPropList.push(remCard);
        });
      } else if (elementDict[name]) {
        cardPropList.push(elementDict[name]);
      }
    });
  } else {
    Object.keys(elementDict).forEach((name) => {
      cardPropList.push(elementDict[name]);
    });
  }

  updateElementNames(cardPropList as ElementProps[]);

  return cardPropList as ElementProps[];
}

// determine the number of element objects from schema and uischema
export function countElementsFromSchema(
  schemaData: JsonSchema | Record<string, unknown>,
): number {
  if (
    !schemaData ||
    typeof schemaData !== 'object' ||
    !('properties' in schemaData) ||
    !schemaData.properties ||
    typeof schemaData.properties !== 'object'
  ) {
    return 0;
  }
  const elementDict: {
    [key: string]: {
      dependents?: Array<{ children: string[]; value?: unknown }>;
      dependent?: boolean;
      parent?: string;
    };
  } = {};
  let elementCount = 0;

  // read regular elements from properties
  Object.entries(schemaData.properties).forEach(([parameter]) => {
    elementDict[parameter] = {};
    elementCount += 1;
  });
  // read dependent elements from dependencies
  if (schemaData.dependencies) {
    const deps = schemaData.dependencies as Record<
      string,
      {
        oneOf?: Array<{ properties?: Record<string, unknown> }>;
        properties?: Record<string, unknown>;
      }
    >;
    Object.keys(deps).forEach((parent) => {
      const group = deps[parent];
      if (group.oneOf) {
        let possibilityIndex = 0;
        group.oneOf.forEach((possibility) => {
          if (!(elementDict[parent] || {}).dependents) {
            elementDict[parent] = elementDict[parent] || {};
            elementDict[parent].dependents = [];
          }
          elementDict[parent].dependents!.push({
            children: [],
            value: possibility.properties?.[parent],
          });
          Object.entries(possibility.properties || {}).forEach(
            ([parameter]) => {
              // create a new element if not present in main properties
              if (!Object.keys(elementDict).includes(parameter)) {
                elementDict[parameter] = {};
                elementCount += 1;
              }
              if (parameter !== parent) {
                const newElement = elementDict[parameter];
                (
                  newElement as { dependent?: boolean; parent?: string }
                ).dependent = true;
                (
                  newElement as { dependent?: boolean; parent?: string }
                ).parent = parent;
                if (elementDict[parent].dependents) {
                  elementDict[parent].dependents[
                    possibilityIndex
                  ].children.push(parameter);
                }
              }
            },
          );
          possibilityIndex += 1;
        });
      } else if (
        'properties' in group &&
        group.properties &&
        typeof group.properties === 'object'
      ) {
        Object.entries(group.properties).forEach(([parameter]) => {
          elementDict[parameter] = elementDict[parameter] || {};
          elementCount += 1;
          if (elementDict[parent]) {
            if (elementDict[parent].dependents) {
              elementDict[parent].dependents[0].children.push(parameter);
            } else {
              elementDict[parent].dependents = [{ children: [parameter] }];
            }
          } else {
            elementDict[parent] = {};
            elementDict[parent].dependents = [{ children: [parameter] }];
          }
        });
      } else {
        console.error('unsupported dependency type encountered');
      }
    });
  }

  return elementCount;
}

// convert an element into a schema equivalent
function generateSchemaElementFromElement(
  element: ElementProps,
): JsonSchemaProperty {
  if (element.$ref !== undefined) {
    const schema = element.schema as
      | JsonSchema
      | Record<string, unknown>
      | undefined;
    const dataOptions = element.dataOptions as
      | JsonSchemaProperty
      | Record<string, unknown>
      | undefined;
    const title =
      schema !== undefined &&
      typeof schema === 'object' &&
      'title' in schema &&
      typeof schema.title === 'string'
        ? schema.title
        : dataOptions &&
            typeof dataOptions === 'object' &&
            'title' in dataOptions &&
            typeof dataOptions.title === 'string'
          ? dataOptions.title
          : undefined;
    const description =
      schema !== undefined &&
      typeof schema === 'object' &&
      'description' in schema &&
      typeof schema.description === 'string'
        ? schema.description
        : dataOptions &&
            typeof dataOptions === 'object' &&
            'description' in dataOptions &&
            typeof dataOptions.description === 'string'
          ? dataOptions.description
          : undefined;

    const returnElement: JsonSchemaProperty = {
      $ref: element.$ref,
    };
    if (title !== undefined) returnElement.title = title;
    if (description !== undefined) returnElement.description = description;

    const required =
      schema &&
      typeof schema === 'object' &&
      'required' in schema &&
      Array.isArray(schema.required)
        ? schema.required
        : undefined;
    if (required && required.length > 0) {
      returnElement.required = required;
    }
    return returnElement;
  } else if (element.propType === 'card') {
    const dataOptions = element.dataOptions as
      | Record<string, unknown>
      | JsonSchemaProperty;
    if (
      typeof dataOptions === 'object' &&
      dataOptions !== null &&
      'category' in dataOptions &&
      dataOptions.category === 'section'
    ) {
      return {
        type: 'object',
      };
    } else {
      const prop: Record<string, unknown> = {};
      const dataOpts = element.dataOptions as Record<string, unknown>;

      Object.keys(dataOpts).forEach((key) => {
        if (
          ![
            'category',
            'hideKey',
            'path',
            'definitionData',
            'definitionUi',
            'allFormInputs',
          ].includes(key) &&
          dataOpts[key] !== ''
        )
          prop[key] = dataOpts[key];
      });
      return prop as JsonSchemaProperty;
    }
  } else if (element.propType === 'section') {
    return (element.schema as JsonSchemaProperty) || {};
  } else {
    throw new Error('Element that is neither card, section, nor ref');
  }
}

// generate a new schema from a complete array of card objects
export function generateSchemaFromElementProps(
  elementArr: ElementProps[],
): JsonSchema {
  if (!elementArr || !Array.isArray(elementArr)) {
    return { type: 'object', properties: {} };
  }
  const newSchema: JsonSchema = {
    type: 'object',
    properties: {},
  };

  const props: { [key: string]: JsonSchemaProperty } = {};
  const dependencies: {
    [key: string]: {
      properties?: { [key: string]: JsonSchemaProperty };
      required?: string[];
      oneOf?: Array<{
        properties: { [key: string]: JsonSchemaProperty };
        required?: string[];
      }>;
    };
  } = {};
  const elementDict: { [key: string]: ElementProps } = {};
  const dependentElements = new Set();
  for (let index = 0; index < elementArr.length; index += 1) {
    const element = elementArr[index];
    elementDict[element.name] = { ...element };
    if (element.dependents) {
      const deps = element.dependents as Array<{
        children: string[];
        value?: unknown;
      }>;
      deps.forEach((possibility) => {
        possibility.children.forEach((dependentElement) => {
          dependentElements.add(dependentElement);
        });
      });
    }
  }
  Object.keys(elementDict).forEach((elementName) => {
    const element = elementDict[elementName];
    if (element.dependents && element.dependents[0]) {
      if (element.dependents[0].value) {
        // handle value based case
        const dependents = element.dependents as Array<{
          children: string[];
          value?: unknown;
        }>;
        dependencies[elementName] = {
          oneOf: dependents.map((possibility) => {
            const childrenComponents: Record<string, JsonSchemaProperty> = {};
            const requiredValues: string[] = [];
            possibility?.children?.forEach((child) => {
              if (elementDict[child]) {
                childrenComponents[child] = generateSchemaElementFromElement(
                  elementDict[child],
                );
                if (elementDict[child].required) requiredValues.push(child);
              }
            });
            return {
              properties: {
                [elementName]: possibility.value as JsonSchemaProperty,
                ...childrenComponents,
              },
              required: requiredValues,
            };
          }),
        };
      } else {
        // handle definition based case
        const childrenComponents: Record<string, JsonSchemaProperty> = {};
        const requiredValues: string[] = [];
        const dependents = element.dependents as Array<{
          children: string[];
          value?: unknown;
        }>;
        dependents[0].children.forEach((child) => {
          childrenComponents[child] = generateSchemaElementFromElement(
            elementDict[child],
          );
          if (elementDict[child].required) requiredValues.push(child);
        });
        dependencies[elementName] = {
          properties: childrenComponents,
          required: requiredValues,
        };
      }
    }
    if (!dependentElements.has(elementName)) {
      props[element.name] = generateSchemaElementFromElement(element);
    }
  });

  newSchema.properties = props;
  newSchema.dependencies = dependencies;
  newSchema.required = elementArr
    .filter(({ required, dependent }) => required && !dependent)
    .map(({ name }) => name);

  return newSchema;
}

export function generateUiSchemaFromElementProps(
  elementArr: Array<ElementProps>,
  definitionUi?: { [key: string]: UiSchemaProperty },
): UiSchema {
  if (!elementArr || !Array.isArray(elementArr)) {
    return { 'ui:order': [] };
  }

  const uiSchema: { [key: string]: UiSchemaProperty } = {};
  const uiOrder: string[] = [];
  const definitions = definitionUi;

  elementArr.forEach((element) => {
    uiOrder.push(element.name);
    if (element.$ref !== undefined && element.name) {
      // look for the reference
      const pathArr =
        typeof element.$ref === 'string' ? element.$ref.split('/') : [];
      if (definitions && pathArr[2] && definitions[pathArr[2]]) {
        uiSchema[element.name] = definitions[pathArr[2]];
      }
    }
    if (element.propType === 'card' && element.uiOptions && element.name) {
      const uiOptions = element.uiOptions as Record<string, unknown>;
      const elementUiSchema: UiSchemaProperty = {};
      Object.keys(uiOptions).forEach((uiOption) => {
        if (uiOption.startsWith('ui:*')) {
          elementUiSchema[uiOption.substring(4)] = uiOptions[uiOption];
        } else {
          elementUiSchema[uiOption] = uiOptions[uiOption];
        }
      });
      uiSchema[element.name] = elementUiSchema;
    } else if (
      element.propType === 'section' &&
      element.uischema &&
      element.name &&
      Object.keys(element.uischema).length > 0
    ) {
      uiSchema[element.name] = element.uischema as UiSchemaProperty;
    }
  });

  const result: UiSchema = { ...uiSchema, 'ui:order': uiOrder };
  if (definitions) {
    result.definitions = definitions;
  }
  return result;
}

export function getCardParameterInputComponentForType(
  category: string,
  allFormInputs: { [key: string]: FormInput },
): CardComponent {
  return (
    (allFormInputs[category] && allFormInputs[category].modalBody) ||
    (() => null)
  );
}

// takes in an array of Card Objects and updates both schemas
export function updateSchemas(
  elementArr: ElementProps[],
  parameters: {
    schema: { [key: string]: any; definitions?: { [key: string]: any } };
    uischema: { [key: string]: any; definitions?: { [key: string]: any } };
    onChange: (
      schema: { [key: string]: any },
      uischema: { [key: string]: any },
    ) => any;
    definitionData?: { [key: string]: any };
    definitionUi?: { [key: string]: any };
  },
) {
  const { schema, uischema, onChange, definitionUi } = parameters;
  const newSchema = Object.assign(
    { ...schema },
    generateSchemaFromElementProps(elementArr),
  );

  const newUiSchema: {
    [key: string]: any;
    definitions?: { [key: string]: any };
  } = generateUiSchemaFromElementProps(elementArr, definitionUi);
  if (uischema.definitions) {
    newUiSchema.definitions = uischema.definitions;
  }

  // mandate that the type is an object if not already done
  newSchema.type = 'object';
  onChange(newSchema, newUiSchema);
}

export const DEFAULT_INPUT_NAME = 'newInput';

// ensure that each added block has a unique name
function getIdFromElementsBlock(elements: Array<ElementProps>) {
  const names = elements.map((element) => element.name);
  const defaultNameLength = DEFAULT_INPUT_NAME.length;

  return names.length > 0
    ? Math.max(
        ...names.map((name) => {
          if (name.startsWith(DEFAULT_INPUT_NAME)) {
            const index = name.substring(defaultNameLength, name.length);
            const value = Number.parseInt(index);

            if (!isNaN(value)) {
              return value;
            }
          }

          return 0;
        }),
      ) + 1
    : 1;
}

// given an initial schema, update with a new card appended
export function addCardObj(parameters: AddFormObjectParameters) {
  const {
    schema,
    uischema,
    mods,
    onChange,
    definitionData,
    definitionUi,
    index,
    categoryHash,
  } = parameters;
  const newElementObjArr = generateElementPropsFromSchemas({
    schema,
    uischema,
    definitionData,
    definitionUi,
    categoryHash,
  });

  const i = getIdFromElementsBlock(newElementObjArr);
  const dataOptions = getNewElementDefaultDataOptions(i, mods);

  const newElement: ElementProps = {
    name: `${DEFAULT_INPUT_NAME}${i}`,
    required: false,
    dataOptions: dataOptions,
    uiOptions: (mods && mods.newElementDefaultUiSchema) || {},
    propType: 'card',
    schema: {},
    uischema: {},
    neighborNames: [],
  };

  if (index !== undefined && index !== null) {
    newElementObjArr.splice(index + 1, 0, newElement);
  } else {
    newElementObjArr.push(newElement);
  }
  updateSchemas(newElementObjArr, {
    schema,
    uischema,
    definitionData,
    definitionUi,
    onChange,
  });
}

// given an initial schema, update with a new section appended
export function addSectionObj(parameters: AddFormObjectParameters) {
  const {
    schema,
    uischema,
    onChange,
    definitionData,
    definitionUi,
    index,
    categoryHash,
  } = parameters;
  const newElementObjArr = generateElementPropsFromSchemas({
    schema,
    uischema,
    definitionData,
    definitionUi,
    categoryHash,
  });

  const i = getIdFromElementsBlock(newElementObjArr);

  const newElement: ElementProps = {
    name: `${DEFAULT_INPUT_NAME}${i}`,
    required: false,
    dataOptions: {
      title: `New Input ${i}`,
      type: 'object',
      default: '',
    },
    uiOptions: {},
    propType: 'section',
    schema: { title: `New Input ${i}`, type: 'object' },
    uischema: {},
    neighborNames: [],
  };

  if (index !== undefined && index !== null) {
    newElementObjArr.splice(index + 1, 0, newElement);
  } else {
    newElementObjArr.push(newElement);
  }
  updateSchemas(newElementObjArr, {
    schema,
    uischema,
    definitionData,
    definitionUi,
    onChange,
  });
}

// generate an array of Card and Section components from a schema
export function generateElementComponentsFromSchemas(parameters: {
  schemaData: { [key: string]: any };
  uiSchemaData: { [key: string]: any };
  onChange: (
    schema: { [key: string]: any },
    uischema: { [key: string]: any },
  ) => any;
  definitionData?: { [key: string]: any };
  definitionUi?: { [key: string]: any };
  hideKey?: boolean;
  path: string;
  cardOpenArray: Array<boolean>;
  setCardOpenArray: (updater: (prev: boolean[]) => boolean[]) => void;
  allFormInputs: { [key: string]: FormInput };
  mods?: Mods;
  categoryHash: { [key: string]: string };
  Card: Card;
  Section: Section;
}): ReactNode[] {
  const {
    schemaData,
    uiSchemaData,
    onChange,
    definitionData,
    definitionUi,
    hideKey,
    path,
    cardOpenArray,
    setCardOpenArray,
    allFormInputs,
    mods,
    categoryHash,
    Card,
    Section,
  } = parameters;

  const schema = parse(stringify(schemaData));
  const uischema = parse(stringify(uiSchemaData));

  if (!schema.properties) return [];
  const elementPropArr = generateElementPropsFromSchemas({
    schema,
    uischema,
    definitionData,
    definitionUi,
    categoryHash,
  });

  // Use ref to access latest cardOpenArray without causing re-renders
  const cardOpenArrayRef = { current: cardOpenArray };

  const elementList = elementPropArr.map((elementProp, index) => {
    const MIN_CARD_OPEN_ARRAY_LENGTH = index + 1;
    const currentLength = cardOpenArrayRef.current.length;
    const addProperties = {
      schema,
      uischema,
      mods,
      onChange,
      definitionData: definitionData || {},
      definitionUi: definitionUi || {},
      index,
      categoryHash,
    };

    if (currentLength < MIN_CARD_OPEN_ARRAY_LENGTH) {
      const newArray = [
        ...cardOpenArrayRef.current,
        ...new Array(MIN_CARD_OPEN_ARRAY_LENGTH - currentLength).fill(false),
      ];
      cardOpenArrayRef.current = newArray;
      // Update the actual state as well
      setCardOpenArray(() => newArray);
    }
    const expanded =
      (cardOpenArrayRef.current &&
        index < cardOpenArrayRef.current.length &&
        cardOpenArrayRef.current[index]) ||
      false;
    if (elementProp.propType === 'card') {
      // choose the appropriate type specific parameters
      const TypeSpecificParameters = getCardParameterInputComponentForType(
        ((elementProp.dataOptions as Record<string, unknown>)
          .category as string) || 'string',
        allFormInputs,
      );

      // add a fully defined card component to the list of components
      return (
        <Card
          componentProps={
            Object.assign(
              {
                name: elementPropArr[index].name,
                required: elementPropArr[index].required,
                hideKey,
                path: `${path}_${elementPropArr[index].name}`,
                definitionData,
                definitionUi,
                neighborNames: elementPropArr[index].neighborNames,
                dependents: elementPropArr[index].dependents,
                dependent: elementPropArr[index].dependent,
                parent: elementPropArr[index].parent,
              },
              elementPropArr[index].uiOptions,
              elementPropArr[index].dataOptions,
            ) as CardComponentProps
          }
          key={`${path}_${elementPropArr[index].name}`}
          TypeSpecificParameters={TypeSpecificParameters}
          onChange={(newCardObj: CardComponentProps) => {
            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });

            // extract uiOptions and other properties
            const newDataProps: Record<string, unknown> = {};
            const newUiProps: Record<string, unknown> = {};
            const cardObj = newCardObj as Record<string, unknown>;
            Object.keys(cardObj).forEach((propName) => {
              if (propName.startsWith('ui:')) {
                if (propName.startsWith('ui:*')) {
                  newUiProps[propName.substring(4)] = cardObj[propName];
                } else {
                  newUiProps[propName] = cardObj[propName];
                }
              } else if (
                ![
                  'name',
                  'required',
                  'neighborNames',
                  'dependents',
                  'dependent',
                  'parent',
                ].includes(propName)
              ) {
                newDataProps[propName] = cardObj[propName];
              }
            });

            if (newElementObjArr[index].propType === 'card') {
              const oldElement = newElementObjArr[index];
              newElementObjArr[index] = {
                ...oldElement,
                dataOptions: newDataProps,
                uiOptions: newUiProps,
                required: newCardObj.required ?? oldElement.required,
                dependents: newCardObj.dependents,
                dependent: newCardObj.dependent,
                parent: newCardObj.parent,
                name: newCardObj.name,
                $ref: newCardObj.$ref,
                propType: 'card',
              };
            } else {
              throw new Error('Card editing non card element');
            }
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          onDelete={() => {
            // splice out this index from the card array
            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });
            newElementObjArr.splice(index, 1);
            setCardOpenArray((prev) => [
              ...prev.slice(0, index),
              ...prev.slice(index + 1),
            ]);
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          onMoveUp={() => {
            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });
            if (index === 0) return;

            const tempBlock = newElementObjArr[index - 1];
            newElementObjArr[index - 1] = newElementObjArr[index];
            newElementObjArr[index] = tempBlock;
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          onMoveDown={() => {
            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });
            if (index === elementPropArr.length - 1) return;

            const tempBlock = newElementObjArr[index + 1];
            newElementObjArr[index + 1] = newElementObjArr[index];
            newElementObjArr[index] = tempBlock;
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          addElem={(choice: string) => {
            if (choice === 'card') {
              addCardObj(addProperties);
            } else if (choice === 'section') {
              addSectionObj(addProperties);
            }
            setCardOpenArray((prev) => [...prev, false]);
          }}
          cardOpen={expanded}
          setCardOpen={(newState: boolean) => {
            setCardOpenArray((prev) => [
              ...prev.slice(0, index),
              newState,
              ...prev.slice(index + 1),
            ]);
          }}
          allFormInputs={allFormInputs}
          mods={mods}
          addProperties={addProperties}
        />
      );
    } else if (elementProp.propType === 'section') {
      // create a section with the appropriate schemas here
      const addProperties = {
        schema,
        uischema,
        mods,
        onChange,
        definitionData: definitionData || {},
        definitionUi: definitionUi || {},
        index,
        categoryHash,
      };
      return (
        <Section
          schema={elementProp.schema}
          uischema={elementProp.uischema}
          onChange={(
            newSchema: { [key: string]: any },
            newUiSchema: { [key: string]: any },
            newRef?: string,
          ) => {
            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });

            const oldSection = newElementObjArr[index];

            newElementObjArr[index] = {
              ...oldSection,
              schema: newSchema,
              uischema: newUiSchema,
              propType: 'section',
            };

            if (newRef) newElementObjArr[index].$ref = newRef;

            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          onNameChange={(newName: string) => {
            const oldSection = elementProp;

            // check if newName overlaps with an existing name
            if (elementPropArr.map((elem) => elem.name).includes(newName))
              return;

            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });
            newElementObjArr[index] = {
              ...oldSection,
              name: newName,
            };
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          onRequireToggle={() => {
            const oldSection = elementProp;

            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });
            newElementObjArr[index] = {
              ...oldSection,
              required: !oldSection.required,
            };
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          onDependentsChange={(
            newDependents: Array<{
              children: Array<string>;
              value?: any;
            }>,
          ) => {
            const oldSection = elementProp;

            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });
            newElementObjArr[index] = {
              ...oldSection,
              dependents: newDependents,
            };
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              onChange,
              definitionData,
              definitionUi,
            });
          }}
          onDelete={() => {
            // splice out this index from the card array
            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });
            newElementObjArr.splice(index, 1);
            setCardOpenArray((prev) => [
              ...prev.slice(0, index),
              ...prev.slice(index + 1),
            ]);
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          onMoveUp={() => {
            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });
            if (index === 0) return;

            const tempBlock = newElementObjArr[index - 1];
            newElementObjArr[index - 1] = newElementObjArr[index];
            newElementObjArr[index] = tempBlock;
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          onMoveDown={() => {
            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });
            if (index === elementPropArr.length - 1) return;

            const tempBlock = newElementObjArr[index + 1];
            newElementObjArr[index + 1] = newElementObjArr[index];
            newElementObjArr[index] = tempBlock;
            updateSchemas(newElementObjArr, {
              schema,
              uischema,
              definitionData,
              definitionUi,
              onChange,
            });
          }}
          name={elementProp.name}
          key={`${path}_${elementPropArr[index].name}`}
          required={elementProp.required}
          path={`${path}_${elementProp.name}`}
          definitionData={definitionData || {}}
          definitionUi={definitionUi || {}}
          hideKey={hideKey}
          reference={elementProp.$ref}
          neighborNames={elementProp.neighborNames}
          dependents={elementProp.dependents!}
          dependent={elementProp.dependent}
          parent={elementProp.parent}
          parentProperties={addProperties}
          cardOpen={expanded}
          setCardOpen={(newState: boolean) => {
            setCardOpenArray((prev) => [
              ...prev.slice(0, index),
              newState,
              ...prev.slice(index + 1),
            ]);
          }}
          allFormInputs={allFormInputs}
          categoryHash={categoryHash}
          mods={mods}
        />
      );
    } else {
      return (
        <div key={`${path}_${elementPropArr[index].name}`}>
          <Typography variant='body1' color='error'>
            Error parsing element
          </Typography>
        </div>
      );
    }
  });

  return elementList;
}

// function called when drag and drop ends
export function onDragEnd(
  result: any,
  details: {
    schema: { [key: string]: any };
    uischema: { [key: string]: any };
    onChange: (
      schema: { [key: string]: any },
      uischema: { [key: string]: any },
    ) => any;
    definitionData?: { [key: string]: any };
    definitionUi?: { [key: string]: any };
    categoryHash: { [key: string]: string };
  },
) {
  const {
    schema,
    uischema,
    onChange,
    definitionData,
    definitionUi,
    categoryHash,
  } = details;
  const src = result.source.index;
  const dest = result.destination.index;
  const newElementObjArr = generateElementPropsFromSchemas({
    schema,
    uischema,
    definitionData,
    definitionUi,
    categoryHash,
  });

  const tempBlock = newElementObjArr[src];
  newElementObjArr[src] = newElementObjArr[dest];
  newElementObjArr[dest] = tempBlock;

  updateSchemas(newElementObjArr, {
    schema,
    uischema,
    definitionData: definitionData || {},
    definitionUi: definitionUi || {},
    onChange,
  });
}

// New drag end handler for @dnd-kit
export function handleDndDragEnd(
  event: DragEndEvent,
  details: {
    schema: { [key: string]: any };
    uischema: { [key: string]: any };
    onChange: (
      schema: { [key: string]: any },
      uischema: { [key: string]: any },
    ) => any;
    definitionData?: { [key: string]: any };
    definitionUi?: { [key: string]: any };
    categoryHash: { [key: string]: string };
  },
) {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const {
    schema,
    uischema,
    onChange,
    definitionData,
    definitionUi,
    categoryHash,
  } = details;

  const elementObjArr = generateElementPropsFromSchemas({
    schema,
    uischema,
    definitionData,
    definitionUi,
    categoryHash,
  });

  // Extract the element name from the ID (ID format is "path_name")
  // The active.id and over.id are like "root_newInput1", we need to extract "newInput1"
  const getElementNameFromId = (id: string | number): string => {
    const idStr = String(id);
    const lastUnderscore = idStr.lastIndexOf('_');
    return lastUnderscore >= 0 ? idStr.substring(lastUnderscore + 1) : idStr;
  };

  const oldElementName = getElementNameFromId(active.id);
  const newElementName = getElementNameFromId(over.id);

  const oldIndex = elementObjArr.findIndex((el) => el.name === oldElementName);
  const newIndex = elementObjArr.findIndex((el) => el.name === newElementName);

  if (oldIndex === -1 || newIndex === -1) return;

  const newElementObjArr = arrayMove(elementObjArr, oldIndex, newIndex);

  updateSchemas(newElementObjArr, {
    schema,
    uischema,
    definitionData: definitionData || {},
    definitionUi: definitionUi || {},
    onChange,
  });
}

// helper function to recursively update sections
function propagateElementChange(
  elementArr: ElementProps[],
  definitionData: { [key: string]: any },
  definitionUi: { [key: string]: any },
  categoryHash: { [key: string]: string },
) {
  const updatedElementArr: ElementProps[] = [];
  elementArr.forEach((element) => {
    // update section and it's children
    if (element.propType === 'section') {
      const childrenElements = generateElementPropsFromSchemas({
        schema: element.schema,
        uischema: element.uischema,
        definitionData,
        definitionUi,
        categoryHash,
      });
      const updatedChildren = propagateElementChange(
        childrenElements,
        definitionData,
        definitionUi,
        categoryHash,
      );
      const newUiSchema = Object.assign(
        { ...element.uischema },
        generateSchemaFromElementProps(updatedChildren),
      );
      const newSchema = Object.assign(
        { ...element.schema },
        generateSchemaFromElementProps(updatedChildren),
      );
      const newElement = {
        ...element,
        schema: newSchema,
        uischema: newUiSchema,
      };
      updatedElementArr.push(newElement);
    } else {
      updatedElementArr.push(element);
    }
  });
  return updatedElementArr;
}

// propogate changes in a schema and ui schema with updated definitions but outdated body componenents
export function propagateDefinitionChanges(
  schema: { [key: string]: any },
  uischema: { [key: string]: any },
  onChange: (
    schema: { [key: string]: any },
    uischema: { [key: string]: any },
  ) => void,
  categoryHash: { [key: string]: string },
) {
  const definitionData = schema.definitions;
  const definitionUi = uischema.definitions;
  const bodyElements = generateElementPropsFromSchemas({
    schema,
    uischema,
    definitionData,
    definitionUi,
    categoryHash,
  });
  const updatedBodyElements = propagateElementChange(
    bodyElements,
    definitionData,
    definitionUi,
    categoryHash,
  );

  updateSchemas(updatedBodyElements, {
    schema,
    uischema,
    definitionData,
    definitionUi,
    onChange,
  });
}

// Member-wise subtraction of array2 from array1
export function subtractArray(array1: string[], array2?: string[]): string[] {
  if (array2 === undefined || array2 === null) return array1;

  // Create a map for performant array filtering on large arrays
  const keys: { [key: string]: any } = array2.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: true,
    }),
    {},
  );

  return array1.filter((v: string) => !keys[v]);
}

export function excludeKeys(
  obj: { [key: string]: any },
  keys?: string[] | null,
) {
  if (!keys) return { ...obj };

  // Create a map for performant object filtering
  const keysHash: { [key: string]: any } = keys.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: true,
    }),
    {},
  );

  // Create a map for performant array filtering
  return Object.keys(obj).reduce(
    (acc, curr) => (keysHash[curr] ? acc : { ...acc, [curr]: obj[curr] }),
    {},
  );
}

export function getNewElementDefaultDataOptions(
  i: number,
  mods?: Mods,
): DataOptions {
  if (mods && mods.newElementDefaultDataOptions !== undefined) {
    const title = `${mods.newElementDefaultDataOptions.title} ${i}`;
    return { ...mods.newElementDefaultDataOptions, ...{ title: title } };
  } else {
    return {
      title: `New Input ${i}`,
      type: 'string',
      default: '',
    };
  }
}

export function getRandomId(): string {
  const chars = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  const numberOfChars = chars.length;
  const randomIdLength = 50;

  return Array.from({ length: randomIdLength })
    .map(() => chars[Math.floor(Math.random() * numberOfChars)])
    .join('');
}

export const DROPPABLE_TYPE = 'rjsfb';
