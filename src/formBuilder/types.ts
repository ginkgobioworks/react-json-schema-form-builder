import { ReactElement, FunctionComponent } from 'react';

export type ComponentProps = {
  dependents: {
    children: string[];
    value?: unknown;
  }[];
  neighborNames: string[];
  name: string;
  schema: Record<string, unknown>;
  type: string;
  'ui:column': string;
  hideKey?: string;
};

export type InputSelectDataType = {
  $ref: string;
  title: string;
  default: string;
  type: string;
  category: string;
};

export type CardComponentPropsType = {
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

export type CardModalProps = {
  componentProps: CardComponentPropsType;
  onChange: (arg0: CardComponentPropsType) => void;
  isOpen: boolean;
  onClose: () => void;
  TypeSpecificParameters: FunctionComponent<{
    parameters: CardComponentPropsType;
    onChange: (newParams: CardComponentPropsType) => void;
  }>;
};

export type CardModalType = FunctionComponent<CardModalProps>;

export type SectionPropsType = {
  name: string;
  required: boolean;
  schema: JsonSchema | Record<string, unknown>;
  uischema: UiSchema | Record<string, unknown>;
  onChange: (
    schema: JsonSchema | Record<string, unknown>,
    uischema: UiSchema | Record<string, unknown>,
    ref?: string,
  ) => void;
  onNameChange: (arg0: string) => void;
  onDependentsChange: (
    arg0: {
      children: string[];
      value?: unknown;
    }[],
  ) => void;
  onRequireToggle: () => unknown;
  onDelete: () => unknown;
  onMoveUp?: () => unknown;
  onMoveDown?: () => unknown;
  path: string;
  definitionData: DefinitionData;
  definitionUi: Record<string, UiSchemaProperty>;
  dependents?: Array<{
    children: Array<string>;
    value?: unknown;
  }>;
  parentProperties: AddFormObjectParametersType;
  neighborNames?: Array<string>;
  cardOpen: boolean;
  setCardOpen: (newState: boolean) => void;
  allFormInputs: Record<string, FormInput>;
  categoryHash: Record<string, string>;
  hideKey?: boolean;
  reference?: string;
  dependent?: boolean;
  parent?: string;
  mods?: Mods;
};

export type SectionType = FunctionComponent<SectionPropsType>;

export type CardPropsType = {
  componentProps: CardComponentPropsType;
  onChange: (newParams: CardComponentPropsType) => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  TypeSpecificParameters: FunctionComponent<{
    parameters: CardComponentPropsType;
    onChange: (newParams: CardComponentPropsType) => void;
  }>;
  addElem?: (choice: string) => void;
  cardOpen: boolean;
  setCardOpen: (newState: boolean) => void;
  mods?: Mods;
  allFormInputs: Record<string, FormInput>;
  showObjectNameInput?: boolean;
  addProperties?: AddFormObjectParametersType;
};

export type CardType = FunctionComponent<CardPropsType>;

// any non object type is a card
export type CardProps = {
  name: string;
  required: boolean;
  dataOptions: JsonSchemaProperty | Record<string, unknown>;
  uiOptions: UiSchemaProperty | Record<string, unknown>;
  // only defined if a reference
  $ref?: string;
  // only defined if a dependency parent
  dependents?: Array<{
    children: Array<string>;
    value?: unknown;
  }>;
  // true if dependent on another card
  dependent?: boolean;
  parent?: string;
  // either 'section' or 'card'
  propType: string;
  neighborNames: Array<string>;
};

// object type elements are sections
export type SectionProps = {
  name: string;
  required: boolean;
  schema: JsonSchema | Record<string, unknown>;
  uischema: UiSchema | Record<string, unknown>;
  // only defined if a reference
  $ref?: string;
  // only defined if a dependency parent
  dependents?: Array<{
    children: Array<string>;
    value?: unknown;
  }>;
  // true if dependent on another card
  dependent?: boolean;
  // either 'section' or 'card'
  propType: string;
  neighborNames: Array<string>;
};

// the most generic form element
export type ElementProps = CardProps & SectionProps;

export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'integer'
  | 'array'
  | 'object'
  | 'null';

type MatchType = {
  types: Array<DataType>;
  widget?: string;
  field?: string;
  format?: string;
  $ref?: boolean;
  enum?: boolean;
};

export type CardComponentType = FunctionComponent<{
  parameters: CardComponentPropsType;
  onChange: (newParams: CardComponentPropsType) => void;
  mods?: Mods;
}>;

// an abstract input type
type FormInputType = {
  displayName: string;
  // given a data and ui schema, determine if the object is of this input type
  matchIf: Array<MatchType>;
  // allowed keys for ui:options
  possibleOptions?: Array<string>;
  defaultDataSchema: JsonSchemaProperty | Record<string, unknown>;
  defaultUiSchema: UiSchemaProperty | Record<string, unknown>;
  // the data schema type
  type: DataType;
  // inputs on the preview card
  cardBody: CardComponentType;
  // inputs for the modal
  modalBody?: CardComponentType;
};

export type DataOptions = {
  title: string;
  type?: string;
  description?: string;
  $ref?: string;
  default?: string | number;
};

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

// optional properties that can add custom features to the form builder
export type Mods = {
  customFormInputs?: Record<string, FormInputType>;
  components?: {
    add?: (
      properties?: AddFormObjectParametersType,
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

export type FormInput = FormInputType;

export type InitParameters = {
  categoryHash?: Record<string, string>;
};

export type FormElement = {
  name?: string;
  title?: string;
  description?: string;
  required?: boolean;
  $ref?: string;
  schema?: JsonSchema | Record<string, unknown>;
  uischema?: UiSchema | Record<string, unknown>;
  propType?: string;
  dataOptions?: JsonSchemaProperty | Record<string, unknown>;
  uiOptions?: UiSchemaProperty | Record<string, unknown>;
  type?: string;
  dependents?: Array<{
    children: string[];
    value?: unknown;
  }>;
  dependent?: boolean;
  parent?: string;
  neighborNames?: string[];
  children?: string[];
  value?: unknown;
};

export type AddFormObjectParametersType = {
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

export type DefinitionData = {
  [key: string]: { 'ui:order'?: string[] };
};

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
