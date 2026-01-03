/**
 * Public API Types
 *
 * These types are exported from the package and are part of the public API.
 * They can be imported by users of the library for type safety when creating
 * custom form inputs, mods, and integrating with the FormBuilder.
 */

import { ReactElement, FunctionComponent } from 'react';

// JSON Schema data types supported by react-jsonschema-form
export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'integer'
  | 'array'
  | 'object'
  | 'null';

// JSON Schema types for better type safety
export type JsonSchemaProperty = {
  type?: DataType;
  title?: string;
  description?: string;
  default?: string | number | boolean | null;
  enum?: (string | number)[];
  enumNames?: string[];
  format?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  minItems?: number;
  maxItems?: number;
  items?: JsonSchemaProperty | { [key: string]: unknown };
  properties?: { [key: string]: JsonSchemaProperty };
  required?: string[];
  dependencies?: {
    [key: string]: {
      properties?: { [key: string]: JsonSchemaProperty };
      required?: string[];
      oneOf?: Array<{
        properties: { [key: string]: JsonSchemaProperty };
        required?: string[];
      }>;
    };
  };
  $ref?: string;
  additionalProperties?: boolean | JsonSchemaProperty;
  $id?: string;
  $schema?: string;
  meta?: Record<string, unknown>;
};

export type JsonSchema = JsonSchemaProperty & {
  type: 'object';
  properties?: Record<string, JsonSchemaProperty>;
  definitions?: Record<string, JsonSchemaProperty>;
};

export type UiSchemaProperty = {
  'ui:order'?: string[];
  'ui:widget'?: string;
  'ui:field'?: string;
  'ui:options'?: { [key: string]: unknown };
  'ui:autofocus'?: boolean;
  'ui:autocomplete'?: string;
  'ui:placeholder'?: string;
  'ui:column'?: string;
  items?: UiSchemaProperty | Record<string, unknown>;
  definitions?: Record<string, UiSchemaProperty>;
  [key: string]: unknown; // Allow other ui: prefixed properties
};

export type UiSchema = UiSchemaProperty & {
  'ui:order'?: string[];
  definitions?: Record<string, UiSchemaProperty>;
  [key: string]: UiSchemaProperty | string[] | unknown;
};

// Matching criteria for form input types
export type Match = {
  types: Array<DataType>;
  widget?: string;
  field?: string;
  format?: string;
  $ref?: boolean;
  enum?: boolean;
};

// Props passed to CardComponent components
export type CardComponentProps = {
  name: string;
  required?: boolean;
  hideKey?: boolean;
  definitionData?: Record<string, unknown>;
  definitionUi?: Record<string, unknown>;
  neighborNames?: string[];
  dependents?: { children: string[]; value?: unknown }[];
  dependent?: boolean;
  parent?: string;
  'ui:options'?: Record<string, unknown>;
  category?: string;
  schema?: Record<string, unknown>;
  type?: string;
  'ui:column'?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  'ui:autofocus'?: boolean;
  'ui:placeholder'?: string;
  minItems?: number;
  maxItems?: number;
  title?: string;
  $ref?: string;
  format?: string;
  'ui:autocomplete'?: string;
  default?: string | number | boolean;
  items?: Record<string, unknown>;
  'ui:*items'?: Record<string, unknown>;
  multipleOf?: number | null;
  minimum?: number | null;
  exclusiveMinimum?: number | null;
  maximum?: number | null;
  exclusiveMaximum?: number | null;
  enum?: (number | string)[];
  enumNames?: string[] | null;
  description?: string;
};

// Component type for card body and modal body
export type CardComponent = FunctionComponent<{
  parameters: CardComponentProps;
  onChange: (newParams: CardComponentProps) => void;
  mods?: Mods;
}>;

// Backward compatibility aliases for renamed types
/** @deprecated Use `CardComponentProps` instead */
export type CardComponentPropsType = CardComponentProps;
/** @deprecated Use `CardComponent` instead */
export type CardComponentType = CardComponent;

// Custom form input type definition
export type FormInput = {
  displayName: string;
  // given a data and ui schema, determine if the object is of this input type
  matchIf: Array<Match>;
  // allowed keys for ui:options
  possibleOptions?: Array<string>;
  defaultDataSchema: JsonSchemaProperty | Record<string, unknown>;
  defaultUiSchema: UiSchemaProperty | Record<string, unknown>;
  // the data schema type
  type: DataType;
  // inputs on the preview card
  cardBody: CardComponent;
  // inputs for the modal
  modalBody?: CardComponent;
};

// Labels customization type
export type ModLabels = {
  formNameLabel?: string;
  formDescriptionLabel?: string;
  objectNameLabel?: string;
  displayNameLabel?: string;
  descriptionLabel?: string;
  inputTypeLabel?: string;
  addElementLabel?: string;
  addSectionLabel?: string;
};

// Default data options for new form elements
export type DataOptions = {
  title: string;
  type?: string;
  description?: string;
  $ref?: string;
  default?: string | number;
};

// Definition data type (used in AddFormObjectParameters)
// Exported because it's part of the public API through AddFormObjectParameters
export type DefinitionData = {
  [key: string]: { 'ui:order'?: string[] };
};

// Parameters for adding form objects programmatically
export type AddFormObjectParameters = {
  schema: JsonSchema | Record<string, unknown>;
  uischema: UiSchema | Record<string, unknown>;
  mods?: Mods;
  onChange: (
    schema: JsonSchema | Record<string, unknown>,
    uischema: UiSchema | Record<string, unknown>,
  ) => unknown;
  definitionData: DefinitionData;
  definitionUi: Record<string, UiSchemaProperty>;
  index?: number;
  categoryHash: Record<string, string>;
};

// Main mods interface for customizing FormBuilder
export type Mods = {
  customFormInputs?: Record<string, FormInput>;
  components?: {
    add?: (
      properties?: AddFormObjectParameters,
    ) => ReactElement | ReactElement[] | [];
  };
  tooltipDescriptions?: {
    add?: string;
    cardObjectName?: string;
    cardDisplayName?: string;
    cardDescription?: string;
    cardInputType?: string;
    cardSectionObjectName?: string;
    cardSectionDisplayName?: string;
    cardSectionDescription?: string;
  };
  labels?: ModLabels;
  showFormHead?: boolean;
  deactivatedFormInputs?: Array<string>;
  newElementDefaultDataOptions?: DataOptions;
  newElementDefaultUiSchema?: UiSchemaProperty | Record<string, unknown>;
};

// Parameters for FormBuilder.onMount callback
export type InitParameters = {
  categoryHash?: Record<string, string>;
};
