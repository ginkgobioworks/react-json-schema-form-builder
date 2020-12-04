// @flow
import * as React from "react";
import { safeLoad as yamlParse, safeDump as yamlStringify } from "js-yaml";
import type { CardProps, ElementProps, FormInput, Mods } from "./types";

// parse in either YAML or JSON
export function parse(text: string, language: string) {
  if (!text) return {};
  return language === "yaml" ? (yamlParse(text): any) : (JSON.parse(text): any);
}

// stringify in either YAML or JSON
export function stringify(obj: any, language: string) {
  if (!obj) return "";
  return language === "yaml"
    ? yamlStringify(obj, { skipInvalid: true })
    : JSON.stringify(obj, null, 5);
}

export function defaultDataProps(
  category: string,
  allFormInputs: { [string]: FormInput }
) {
  return allFormInputs[category].defaultDataSchema;
}

export function defaultUiProps(
  category: string,
  allFormInputs: { [string]: FormInput }
) {
  return allFormInputs[category].defaultUiSchema;
}
export function categoryType(
  category: string,
  allFormInputs: { [string]: FormInput }
) {
  return allFormInputs[category].type;
}
export function getCardBody(
  category: string,
  allFormInputs: { [string]: FormInput }
) {
  return allFormInputs[category].cardBody;
}
export function categoryToNameMap(
  category: string,
  allFormInputs: { [string]: FormInput }
) {
  const categoryNameMap = {};
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

export function generateCategoryHash(allFormInputs: { [string]: FormInput }) {
  const categoryHash = {};
  Object.keys(allFormInputs).forEach((categoryName) => {
    const formInput = allFormInputs[categoryName];
    formInput.matchIf.forEach((match) => {
      match.types.forEach((type) => {
        const hash = `type:${type || ""};widget:${match.widget || ""};field:${
          match.field || ""
        };format:${match.format || ""};$ref:${
          match.$ref ? "true" : "false"
        };enum:${match.enum ? "true" : "false"}`;
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
  categoryHash: { [string]: string }
) {
  const currentHash = `type:${cardProps.dataOptions.type || ""};widget:${
    cardProps.uiOptions["ui:widget"] || ""
  };field:${cardProps.uiOptions["ui:field"] || ""};format:${
    cardProps.dataOptions.format || ""
  };$ref:${cardProps.$ref !== undefined ? "true" : "false"};enum:${
    cardProps.dataOptions.enum ? "true" : "false"
  }`;
  const category = categoryHash[currentHash];
  if (!category) {
    if (cardProps.$ref) return "ref";
    // eslint-disable-next-line no-console
    console.error(`No match for card': ${currentHash} among set`);
    return "shortAnswer";
  }
  return category;
}

// check for unsupported feature in schema and uischema
const supportedPropertyParameters = new Set([
  "title",
  "description",
  "enum",
  "minLength",
  "maxLength",
  "multipleOf",
  "minimum",
  "maximum",
  "format",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "type",
  "default",
  "pattern",
  "required",
  "properties",
  "items",
  "definitions",
  "$ref",
  "minItems",
  "maxItems",
  "enumNames",
  "dependencies",
  "$id",
]);

const supportedUiParameters = new Set([
  "ui:order",
  "ui:widget",
  "ui:autofocus",
  "ui:autocomplete",
  "ui:option",
  "ui:field",
  "items",
  "definitions",
]);

// recursively called function to check an object for unsupported features
function checkObjectForUnsupportedFeatures(
  schema: { [string]: any },
  uischema: { [string]: any },
  supportedWidgets: Set<string>,
  supportedFields: Set<string>,
  supportedOptions: Set<string>
) {
  // add each unsupported feature to this array
  const unsupportedFeatures = [];

  // check for unsupported whole object features
  if (schema && typeof schema === "object")
    Object.keys(schema).forEach((property) => {
      if (
        !supportedPropertyParameters.has(property) &&
        property !== "properties"
      )
        unsupportedFeatures.push(`Unrecognized Object Property: ${property}`);
    });

  if (uischema && typeof uischema === "object")
    Object.keys(uischema).forEach((uiProperty) => {
      let propDefined = false;
      // search for the property in the schema properties and dependencies
      if (
        schema.properties &&
        Object.keys(schema.properties).includes(uiProperty)
      )
        propDefined = true;
      if (schema.dependencies) {
        Object.keys(schema.dependencies).forEach((dependencyKey) => {
          Object.keys(schema.dependencies[dependencyKey]).forEach(
            (parameter) => {
              if (parameter === "oneOf") {
                schema.dependencies[dependencyKey].oneOf.forEach((grouping) => {
                  if (grouping.properties)
                    if (Object.keys(grouping.properties).includes(uiProperty))
                      propDefined = true;
                });
              } else if (parameter === "properties") {
                if (
                  Object.keys(
                    schema.dependencies[dependencyKey].properties
                  ).includes(uiProperty)
                )
                  propDefined = true;
              }
            }
          );
        });
      }

      if (!propDefined && !supportedUiParameters.has(uiProperty))
        unsupportedFeatures.push(
          `Unrecognized UI schema property: ${uiProperty}`
        );
    });

  // check for unsupported property parameters
  if (schema.properties)
    Object.entries(schema.properties).forEach(
      ([parameter, element]: [string, any]) => {
        const correctName = parameter.replace(/\W/g, "_");
        if (parameter !== correctName) {
          unsupportedFeatures.push(
            `Improper name '${parameter}': using '${correctName}' instead`
          );
        }
        if (
          element &&
          typeof element === "object" &&
          element.type &&
          element.type !== "object"
        ) {
          // make sure that the type is valid
          if (
            !["array", "string", "integer", "number", "boolean"].includes(
              element.type
            )
          )
            unsupportedFeatures.push(
              `Unrecognized type: ${element.type} in ${parameter}`
            );
          // check the properties of each property if it is a basic object
          Object.keys(element).forEach((key) => {
            if (!supportedPropertyParameters.has(key))
              unsupportedFeatures.push(
                `Property Parameter: ${key} in ${parameter}`
              );
          });
        } else {
          // check the properties of each property if it is a basic object
          Object.keys(element).forEach((key) => {
            if (!supportedPropertyParameters.has(key))
              unsupportedFeatures.push(
                `Property Parameter: ${key} in ${parameter}`
              );
          });
        }

        // check for unsupported UI components
        if (
          uischema &&
          uischema[parameter] &&
          element &&
          (!element.type || element.type !== "object")
        ) {
          // check for unsupported ui properties
          Object.keys(uischema[parameter]).forEach((uiProp) => {
            if (!supportedUiParameters.has(uiProp))
              unsupportedFeatures.push(
                `UI Property: ${uiProp} for ${parameter}`
              );

            // check for unsupported ui widgets
            if (
              uiProp === "ui:widget" &&
              !supportedWidgets.has(uischema[parameter][uiProp])
            ) {
              unsupportedFeatures.push(
                `UI Widget: ${uischema[parameter][uiProp]} for ${parameter}`
              );
            }

            // check for unsupported ui fields
            if (
              uiProp === "ui:field" &&
              !supportedFields.has(uischema[parameter][uiProp])
            )
              unsupportedFeatures.push(
                `UI Field: ${uischema[parameter][uiProp]} for ${parameter}`
              );

            // check unsupported ui option
            if (uiProp === "ui:option")
              Object.keys(uischema[parameter]["ui:option"]).forEach(
                (uiOption) => {
                  if (!supportedOptions.has(uiOption))
                    unsupportedFeatures.push(
                      `UI Property: ui:option.${uiOption} for ${parameter}`
                    );
                }
              );
          });
        }
      }
    );
  return unsupportedFeatures;
}

// parent function that checks for unsupported features in an entire document
export function checkForUnsupportedFeatures(
  schema: { [string]: any },
  uischema: { [string]: any },
  allFormInputs: { [string]: FormInput }
) {
  // add each unsupported feature to this array
  const unsupportedFeatures = [];

  const widgets = [];
  const fields = [];
  const options = [];
  Object.keys(allFormInputs).forEach((inputType) => {
    allFormInputs[inputType].matchIf.forEach((match) => {
      if (match.widget && !widgets.includes(match.widget))
        widgets.push(match.widget);
      if (match.field && !fields.includes(match.field))
        fields.push(match.field);
    });
    if (
      allFormInputs[inputType].possibleOptions &&
      Array.isArray(allFormInputs[inputType].possibleOptions)
    ) {
      options.push(...allFormInputs[inputType].possibleOptions);
    }
  });
  const supportedWidgets = new Set(widgets);
  const supportedFields = new Set(fields);
  const supportedOptions = new Set(options);

  // check for unsupported whole form features
  if (schema && typeof schema === "object" && schema.type === "object") {
    unsupportedFeatures.push(
      ...checkObjectForUnsupportedFeatures(
        schema,
        uischema,
        supportedWidgets,
        supportedFields,
        supportedOptions
      )
    );
  } else {
    unsupportedFeatures.push("jsonSchema form is not of type object");
  }

  return unsupportedFeatures;
}

// make an element out of the corresponding properties and UI properties
function generateElement(
  name: string,
  dataProps: any,
  uiProperties: any,
  requiredNames: any,
  definitionData?: { [string]: any },
  definitionUi?: { [string]: any },
  categoryHash: { [string]: string }
) {
  let uiProps = {
    ...uiProperties,
  };
  const newElement = {};
  let elementDetails =
    dataProps && typeof dataProps === "object" ? dataProps : {};

  // populate newElement with reference if applicable
  if (elementDetails.$ref !== undefined && definitionData) {
    const pathArr =
      typeof elementDetails.$ref === "string"
        ? elementDetails.$ref.split("/")
        : [];
    if (
      pathArr[0] === "#" &&
      pathArr[1] === "definitions" &&
      definitionData[pathArr[2]]
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
    typeof elementDetails.$ref === "string" ? elementDetails.$ref : undefined;

  if (elementDetails.type && elementDetails.type === "object") {
    // create a section
    newElement.schema = elementDetails;
    newElement.uischema = uiProps || {};
    newElement.propType = "section";
  } else {
    // create a card
    newElement.dataOptions = elementDetails;
    newElement.uiOptions = uiProps || {};

    // ensure that uiOptions does not have duplicate keys with dataOptions
    const reservedKeys = Object.keys(newElement.dataOptions);
    Object.keys(newElement.uiOptions).forEach((uiKey) => {
      if (reservedKeys.includes(uiKey)) {
        newElement.uiOptions[`ui:*${uiKey}`] = newElement.uiOptions[uiKey];
      }
    });

    newElement.dataOptions.category = getCardCategory(newElement, categoryHash);
    newElement.propType = "card";
  }
  return newElement;
}

// generate an array of element objects from a schema and uischema
export function generateElementPropsFromSchemas(parameters: {
  schema: { [string]: any },
  uischema: { [string]: any },
  definitionData?: { [string]: any },
  definitionUi?: { [string]: any },
  categoryHash: { [string]: string },
}) {
  const {
    schema,
    uischema,
    definitionData,
    definitionUi,
    categoryHash,
  } = parameters;

  if (!schema.properties) return [];

  const elementDict = {};
  const requiredNames = schema.required ? schema.required : [];

  // read regular elements from properties
  Object.entries(schema.properties).forEach(([parameter, element]) => {
    const newElement = {};
    let elementDetails =
      element && typeof element === "object"
        ? (element: {
            ...any,
            $ref?: string,
          })
        : {};

    // populate newElement with reference if applicable
    if (elementDetails.$ref !== undefined && definitionData) {
      if (
        elementDetails.$ref &&
        !elementDetails.$ref.startsWith("#/definitions")
      )
        throw new Error(
          `Invalid definition, not at '#/definitions': ${elementDetails.$ref}`
        );
      const pathArr =
        elementDetails.$ref !== undefined ? elementDetails.$ref.split("/") : [];
      if (
        pathArr[0] === "#" &&
        pathArr[1] === "definitions" &&
        definitionData[pathArr[2]]
      ) {
        elementDetails = {
          ...elementDetails,
          ...definitionData[pathArr[2]],
        };
      }

      const definedUiProps = (definitionUi || {})[pathArr[2]];
      uischema[parameter] = {
        ...(definedUiProps || {}),
        ...uischema[parameter],
      };
    }

    newElement.name = parameter;
    newElement.required = requiredNames.includes(parameter);
    newElement.$ref = elementDetails.$ref;

    if (elementDetails.type && elementDetails.type === "object") {
      // create a section
      newElement.schema = elementDetails;
      newElement.uischema = uischema[parameter] || {};
      newElement.propType = "section";
    } else {
      // create a card
      newElement.dataOptions = elementDetails;
      newElement.uiOptions = uischema[parameter] || {};

      // ensure that uiOptions does not have duplicate keys with dataOptions
      const reservedKeys = Object.keys(newElement.dataOptions);
      Object.keys(newElement.uiOptions).forEach((uiKey) => {
        if (reservedKeys.includes(uiKey)) {
          newElement.uiOptions[`ui:*${uiKey}`] = newElement.uiOptions[uiKey];
        }
      });

      newElement.dataOptions.category = getCardCategory(
        newElement,
        categoryHash
      );
      newElement.propType = "card";
    }
    elementDict[newElement.name] = newElement;
  });
  // read dependent elements from dependencies
  if (schema.dependencies) {
    Object.keys(schema.dependencies).forEach((parent) => {
      const group = schema.dependencies[parent];
      if (group.oneOf) {
        let possibilityIndex = 0;
        group.oneOf.forEach((possibility) => {
          if (!elementDict[parent].dependents) {
            elementDict[parent].dependents = [];
          }
          elementDict[parent].dependents.push({
            children: [],
            value: possibility.properties[parent],
          });
          const requiredValues = possibility.required || [];
          Object.entries(possibility.properties).forEach(
            ([parameter, element]) => {
              // create a new element if not present in main properties
              if (!Object.keys(elementDict).includes(parameter)) {
                const newElement = generateElement(
                  parameter,
                  element,
                  uischema[parameter],
                  requiredNames,
                  definitionData,
                  definitionUi,
                  categoryHash
                );
                newElement.required = requiredValues.includes(newElement.name);
                elementDict[newElement.name] = newElement;
              }
              if (parameter !== parent) {
                const newElement = elementDict[parameter];
                newElement.dependent = true;
                newElement.parent = parent;
                elementDict[parent].dependents[possibilityIndex].children.push(
                  parameter
                );
              }
            }
          );
          possibilityIndex += 1;
        });
      } else if (group.properties) {
        const requiredValues = group.required || [];
        Object.entries(group.properties).forEach(([parameter, element]) => {
          const newElement = generateElement(
            parameter,
            element,
            uischema[parameter],
            requiredNames,
            definitionData,
            definitionUi,
            categoryHash
          );
          newElement.required = requiredValues.includes(newElement.name);
          newElement.dependent = true;
          newElement.parent = parent;
          elementDict[newElement.name] = newElement;
          if (elementDict[parent].dependents) {
            elementDict[parent].dependents[0].children.push(parameter);
          } else {
            elementDict[parent].dependents = [{ children: [parameter] }];
          }
        });
      } else {
        // eslint-disable-next-line no-console
        console.error("unsupported dependency type encountered");
      }
    });
  }

  // now reorder in accordance with ui:order if defined
  const cardPropList = [];
  if (uischema["ui:order"]) {
    // in case there are any options not in ui:order
    const remainder = [];
    Object.keys(elementDict).forEach((name) => {
      if (!uischema["ui:order"].includes(name))
        remainder.push(elementDict[name]);
    });

    // map ui order elements into the right order
    uischema["ui:order"].forEach((name) => {
      // if contains the wildcard *, insert remainder cards there
      if (name === "*") {
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

  updateElementNames(cardPropList);
  return (cardPropList: Array<ElementProps>);
}

// determine the number of element objects from schema and uischema
export function countElementsFromSchema(schemaData: any) {
  if (!schemaData.properties) return 0;
  const elementDict = {};
  let elementCount = 0;

  // read regular elements from properties
  Object.entries(schemaData.properties).forEach(([parameter]) => {
    elementDict[parameter] = {};
    elementCount += 1;
  });
  // read dependent elements from dependencies
  if (schemaData.dependencies) {
    Object.keys(schemaData.dependencies).forEach((parent) => {
      const group = schemaData.dependencies[parent];
      if (group.oneOf) {
        let possibilityIndex = 0;
        group.oneOf.forEach((possibility) => {
          if (!elementDict[parent].dependents) {
            elementDict[parent].dependents = [];
          }
          elementDict[parent].dependents.push({
            children: [],
            value: possibility.properties[parent],
          });
          Object.entries(possibility.properties).forEach(([parameter]) => {
            // create a new element if not present in main properties
            if (!Object.keys(elementDict).includes(parameter)) {
              elementDict[parameter] = {};
              elementCount += 1;
            }
            if (parameter !== parent) {
              const newElement = elementDict[parameter];
              newElement.dependent = true;
              newElement.parent = parent;
              elementDict[parent].dependents[possibilityIndex].children.push(
                parameter
              );
            }
          });
          possibilityIndex += 1;
        });
      } else if (group.properties) {
        Object.entries(group.properties).forEach(([parameter]) => {
          elementDict[parameter] = {};
          elementCount += 1;
          if (elementDict[parent].dependents) {
            elementDict[parent].dependents[0].children.push(parameter);
          } else {
            elementDict[parent].dependents = [{ children: [parameter] }];
          }
        });
      } else {
        // eslint-disable-next-line no-console
        console.error("unsupported dependency type encountered");
      }
    });
  }

  return (elementCount: number);
}

// convert an element into a schema equivalent
function generateSchemaElementFromElement(element: ElementProps) {
  if (element.$ref !== undefined) {
    return {
      $ref: element.$ref,
    };
  } else if (element.propType === "card") {
    if (element.dataOptions.category === "section") {
      return {
        type: "object",
      };
    } else {
      const prop = {};

      Object.keys(element.dataOptions).forEach((key) => {
        if (
          ![
            "category",
            "hideKey",
            "path",
            "definitionData",
            "definitionUi",
            "allFormInputs",
          ].includes(key) &&
          element.dataOptions[key] !== ""
        )
          prop[key] = element.dataOptions[key];
      });
      return prop;
    }
  } else if (element.propType === "section") {
    return element.schema;
  } else {
    throw new Error("Element that is neither card, section, nor ref");
  }
}

// generate a new schema from a complete array of card objects
export function generateSchemaFromElementProps(
  elementArr: Array<ElementProps>
) {
  if (!elementArr) return {};
  const newSchema = {};

  const props = {};
  const dependencies = {};
  const elementDict = {};
  const dependentElements = new Set([]);
  for (let index = 0; index < elementArr.length; index += 1) {
    const element = elementArr[index];
    elementDict[element.name] = { ...element };
    if (element.dependents)
      element.dependents.forEach((possibility) => {
        possibility.children.forEach((dependentElement) => {
          dependentElements.add(dependentElement);
        });
      });
  }
  Object.keys(elementDict).forEach((elementName) => {
    const element = elementDict[elementName];
    if (element.dependents && element.dependents[0]) {
      if (element.dependents[0].value) {
        // handle value based case
        dependencies[elementName] = {
          oneOf: element.dependents.map((possibility) => {
            const childrenComponents = {};
            const requiredValues = [];
            possibility.children.forEach((child) => {
              if (elementDict[child]) {
                childrenComponents[child] = generateSchemaElementFromElement(
                  elementDict[child]
                );
                if (elementDict[child].required) requiredValues.push(child);
              }
            });
            return {
              properties: {
                [elementName]: possibility.value,
                ...childrenComponents,
              },
              required: requiredValues,
            };
          }),
        };
      } else {
        // handle definition based case
        const childrenComponents = {};
        const requiredValues = [];
        element.dependents[0].children.forEach((child) => {
          childrenComponents[child] = generateSchemaElementFromElement(
            elementDict[child]
          );
          if (elementDict[child].required) requiredValues.push(child);
        });
        dependencies[elementName] = {
          properties: childrenComponents,
          required: requiredValues,
        };
      }
    }
    if (!dependentElements.has(elementName))
      props[element.name] = generateSchemaElementFromElement(element);
  });

  newSchema.properties = props;
  newSchema.dependencies = dependencies;
  newSchema.required = elementArr
    .filter(({ required, dependent }) => required && !dependent)
    .map<string>(({ name }) => name);

  return newSchema;
}

export function generateUiSchemaFromElementProps(
  elementArr: Array<ElementProps>,
  definitionUi: any
) {
  if (!elementArr) return {};

  const uiSchema = {};
  const uiOrder = [];
  const definitions = definitionUi;

  elementArr.forEach((element) => {
    uiOrder.push(element.name);
    if (element.$ref !== undefined) {
      // look for the reference
      const pathArr =
        typeof element.$ref === "string" ? element.$ref.split("/") : [];
      if (definitions && definitions[pathArr[2]])
        uiSchema[element.name] = definitions[pathArr[2]];
    } else if (element.propType === "card" && element.uiOptions) {
      Object.keys(element.uiOptions).forEach((uiOption) => {
        if (!uiSchema[element.name]) uiSchema[element.name] = {};
        if (uiOption.startsWith("ui:*")) {
          uiSchema[element.name][uiOption.substring(4)] =
            element.uiOptions[uiOption];
        } else {
          uiSchema[element.name][uiOption] = element.uiOptions[uiOption];
        }
      });
    } else if (element.propType === "section" && element.uischema) {
      uiSchema[element.name] = element.uischema;
    }
  });

  uiSchema["ui:order"] = uiOrder;

  return uiSchema;
}

export function getCardParameterInputComponentForType(
  category: string,
  allFormInputs: { [string]: FormInput }
) {
  return allFormInputs[category].modalBody;
}

// takes in an array of Card Objects and updates both schemas
export function updateSchemas(
  elementArr: Array<ElementProps>,
  parameters: {
    schema: { [string]: any },
    uischema: { [string]: any },
    onChange: ({ [string]: any }, { [string]: any }) => any,
    definitionData?: { [string]: any },
    definitionUi?: { [string]: any },
  }
) {
  const { schema, uischema, onChange, definitionUi } = parameters;
  const definedUi = (uischema || {}).definitions
    ? { definitions: uischema.definitions }
    : {};
  const newUiSchema = ({
    ...definedUi,
    ...generateUiSchemaFromElementProps(elementArr, definitionUi),
  }: { [string]: any });
  const newSchema = ({
    ...schema,
    ...generateSchemaFromElementProps(elementArr),
  }: { [string]: any });

  // mandate that the type is an object if not already done
  newSchema.type = "object";

  onChange(newSchema, newUiSchema);
}

// given an initial schema, update with a new card appended
export function addCardObj(parameters: {
  schema: { [string]: any },
  uischema: { [string]: any },
  onChange: ({ [string]: any }, { [string]: any }) => any,
  definitionData: { [string]: any },
  definitionUi: { [string]: any },
  index?: number,
  categoryHash: { [string]: string },
}) {
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

  // ensure that each added block has a unique name

  const names = newElementObjArr.map((element) => element.name);
  const i =
    names.length > 0
      ? Math.max(
          ...names.map((name) =>
            name.startsWith("newInput")
              ? Number.parseInt(name.charAt(8), 10)
              : 0
          )
        ) + 1
      : 1;

  const newElement = ({
    name: `newInput${i}`,
    required: false,
    dataOptions: {
      title: `New Input ${i}`,
      type: "string",
      default: "",
    },
    uiOptions: {},
    propType: "card",
    schema: {},
    uischema: {},
    neighborNames: [],
  }: ElementProps);

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
export function addSectionObj(parameters: {
  schema: { [string]: any },
  uischema: { [string]: any },
  onChange: ({ [string]: any }, { [string]: any }) => any,
  definitionData: { [string]: any },
  definitionUi: { [string]: any },
  index?: number,
  categoryHash: { [string]: string },
}) {
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

  // ensure that each added block has a unique name
  const names = newElementObjArr.map((element) => element.name);
  const i =
    names.length > 0
      ? Math.max(
          ...names.map((name) =>
            name.startsWith("newInput")
              ? Number.parseInt(name.charAt(8), 10)
              : 0
          )
        ) + 1
      : 1;

  const newElement = ({
    name: `newInput${i}`,
    required: false,
    dataOptions: {
      title: `New Input ${i}`,
      type: "object",
      default: "",
    },
    uiOptions: {},
    propType: "section",
    schema: { title: `New Input ${i}`, type: "object" },
    uischema: {},
    neighborNames: [],
  }: ElementProps);

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
  schemaData: { [string]: any },
  uiSchemaData: { [string]: any },
  onChange: ({ [string]: any }, { [string]: any }) => any,
  definitionData?: { [string]: any },
  definitionUi?: { [string]: any },
  hideKey?: boolean,
  path: string,
  cardOpenArray: Array<boolean>,
  setCardOpenArray: (newArr: Array<boolean>) => void,
  allFormInputs: { [string]: FormInput },
  mods?: Mods,
  categoryHash: { [string]: string },
  Card: React.AbstractComponent<{ [string]: any }>,
  Section: React.AbstractComponent<{ [string]: any }>,
}) {
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

  const schema = parse(stringify(schemaData, "yaml"), "yaml");
  const uischema = parse(stringify(uiSchemaData, "yaml"), "yaml");

  if (!schema.properties) return [];
  const elementPropArr = generateElementPropsFromSchemas({
    schema,
    uischema,
    definitionData,
    definitionUi,
    categoryHash,
  });

  const elementList = elementPropArr.map<React.Node>((elementProp, index) => {
    const expanded =
      (cardOpenArray && index < cardOpenArray.length && cardOpenArray[index]) ||
      false;
    if (elementProp.propType === "card") {
      // choose the appropriate type specific parameters
      const TypeSpecificParameters = getCardParameterInputComponentForType(
        elementProp.dataOptions.category || "string",
        allFormInputs
      );

      // add a fully defined card component to the list of components
      return (
        <Card
          componentProps={{
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
            ...elementPropArr[index].uiOptions,
            ...elementPropArr[index].dataOptions,
          }}
          key={`${path}_${elementPropArr[index].name}`}
          TypeSpecificParameters={TypeSpecificParameters}
          onChange={(newCardObj: { [string]: any }) => {
            const newElementObjArr = generateElementPropsFromSchemas({
              schema,
              uischema,
              definitionData,
              definitionUi,
              categoryHash,
            });

            // extract uiOptions and other properties
            const newDataProps = {};
            const newUiProps = {};
            Object.keys(newCardObj).forEach((propName) => {
              if (propName.startsWith("ui:")) {
                if (propName.startsWith("ui:*")) {
                  newUiProps[propName.substring(4)] = newCardObj[propName];
                } else {
                  newUiProps[propName] = newCardObj[propName];
                }
              } else if (
                ![
                  "name",
                  "required",
                  "lang",
                  "neighborNames",
                  "dependents",
                  "dependent",
                  "parent",
                ].includes(propName)
              ) {
                newDataProps[propName] = newCardObj[propName];
              }
            });

            if (newElementObjArr[index].propType === "card") {
              const oldElement = newElementObjArr[index];
              newElementObjArr[index] = {
                ...oldElement,
                dataOptions: newDataProps,
                uiOptions: newUiProps,
                required: newCardObj.required,
                dependents: newCardObj.dependents,
                dependent: newCardObj.dependent,
                parent: newCardObj.parent,
                name: newCardObj.name,
                $ref: newCardObj.$ref,
                propType: "card",
              };
            } else {
              throw new Error("Card editing non card element");
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
            setCardOpenArray([
              ...cardOpenArray.slice(0, index),
              ...cardOpenArray.slice(index + 1),
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
            if (choice === "card") {
              addCardObj({
                schema,
                uischema,
                onChange,
                definitionData: definitionData || {},
                definitionUi: definitionUi || {},
                index,
                categoryHash,
              });
            } else if (choice === "section") {
              addSectionObj({
                schema,
                uischema,
                onChange,
                definitionData: definitionData || {},
                definitionUi: definitionUi || {},
                index,
                categoryHash,
              });
            }
            setCardOpenArray([...cardOpenArray, false]);
          }}
          cardOpen={expanded}
          setCardOpen={(newState: boolean) =>
            setCardOpenArray([
              ...cardOpenArray.slice(0, index),
              newState,
              ...cardOpenArray.slice(index + 1),
            ])
          }
          allFormInputs={allFormInputs}
          mods={mods}
        />
      );
    } else if (elementProp.propType === "section") {
      // create a section with the appropriate schemas here
      return (
        <Section
          schema={elementProp.schema}
          uischema={elementProp.uischema}
          onChange={(
            newSchema: { [string]: any },
            newUiSchema: { [string]: any },
            newRef?: string
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
              propType: "section",
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
              children: Array<string>,
              value?: any,
            }>
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
            setCardOpenArray([
              ...cardOpenArray.slice(0, index),
              ...cardOpenArray.slice(index + 1),
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
          dependents={elementProp.dependents}
          dependent={elementProp.dependent}
          parent={elementProp.parent}
          addElem={(choice: string) => {
            if (choice === "card") {
              addCardObj({
                schema,
                uischema,
                onChange,
                definitionData: definitionData || {},
                definitionUi: definitionUi || {},
                index,
                categoryHash,
              });
            } else if (choice === "section") {
              addSectionObj({
                schema,
                uischema,
                onChange,
                definitionData: definitionData || {},
                definitionUi: definitionUi || {},
                index,
                categoryHash,
              });
            }
            setCardOpenArray([...cardOpenArray, false]);
          }}
          cardOpen={expanded}
          setCardOpen={(newState: boolean) =>
            setCardOpenArray([
              ...cardOpenArray.slice(0, index),
              newState,
              ...cardOpenArray.slice(index + 1),
            ])
          }
          allFormInputs={allFormInputs}
          categoryHash={categoryHash}
        />
      );
    } else {
      return (
        <div>
          <h2> Error parsing element </h2>
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
    schema: { [string]: any },
    uischema: { [string]: any },
    onChange: ({ [string]: any }, { [string]: any }) => any,
    definitionData?: { [string]: any },
    definitionUi?: { [string]: any },
    categoryHash: { [string]: string },
  }
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

// helper function to recursively update sections
function propagateElementChange(
  elementArr: Array<ElementProps>,
  definitionData: { [string]: any },
  definitionUi: { [string]: any },
  categoryHash: { [string]: string }
) {
  const updatedElementArr = [];
  elementArr.forEach((element) => {
    // update section and it's children
    if (element.propType === "section") {
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
        categoryHash
      );
      const newUiSchema = {
        ...element.uischema,
        ...generateUiSchemaFromElementProps(updatedChildren, definitionUi),
      };
      const newSchema = {
        ...element.schema,
        ...generateSchemaFromElementProps(updatedChildren),
      };
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
  schema: { [string]: any },
  uischema: { [string]: any },
  onChange: ({ [string]: any }, { [string]: any }) => void,
  categoryHash: { [string]: string }
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
    categoryHash
  );

  updateSchemas(updatedBodyElements, {
    schema,
    uischema,
    definitionData,
    definitionUi,
    onChange,
  });
}
