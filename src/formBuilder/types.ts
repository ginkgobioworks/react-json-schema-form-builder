import { ReactElement, FunctionComponent } from 'react';

export interface ComponentProps {
  dependents: {
    children: string[];
    value?: any;
  }[];
  neighborNames: string[];
  name: string;
  schema: { [key: string]: any };
  type: string;
  'ui:column': string;
  hideKey?: string;
}

export interface InputSelectDataType {
  $ref: string;
  title: string;
  default: string;
  type: string;
  category: string;
}

export interface CardComponentPropsType {
  name: string;
  required?: boolean;
  hideKey?: boolean;
  definitionData?: { [key: string]: any };
  definitionUi?: { [key: string]: any };
  neighborNames?: string[];
  dependents?: { children: string[]; value?: any }[];
  dependent?: boolean;
  parent?: string;
  'ui:options'?: { [key: string]: any };
  category?: string;
  schema?: { [key: string]: any };
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
  items?: { [key: string]: any };
  'ui:*items'?: { [key: string]: any };
  multipleOf?: number | null;
  minimum?: number | null;
  exclusiveMinimum?: number | null;
  maximum?: number | null;
  exclusiveMaximum?: number | null;
  enum?: (number | string)[];
  enumNames?: string[] | null;
  description?: string;
}

export interface CardModalProps {
  componentProps: CardComponentPropsType;
  onChange: (arg0: any) => void;
  isOpen: boolean;
  onClose: () => void;
  TypeSpecificParameters: FunctionComponent<{
    parameters: CardComponentPropsType;
    onChange: (newParams: CardComponentPropsType) => void;
  }>;
}

export type CardModalType = FunctionComponent<CardModalProps>;

export interface SectionPropsType {
  name: string;
  required: boolean;
  schema: { [key: string]: any };
  uischema: { [key: string]: any };
  onChange: (
    schema: { [key: string]: any },
    uischema: { [key: string]: any },
    ref?: string,
  ) => void;
  onNameChange: (arg0: string) => void;
  onDependentsChange: (
    arg0: {
      children: string[];
      value?: any;
    }[],
  ) => void;
  onRequireToggle: () => any;
  onDelete: () => any;
  onMoveUp?: () => any;
  onMoveDown?: () => any;
  path: string;
  definitionData: { [key: string]: any };
  definitionUi: { [key: string]: any };
  dependents?: Array<{
    children: Array<string>;
    value?: any;
  }>;
  parentProperties: AddFormObjectParametersType;
  neighborNames?: Array<string>;
  cardOpen: boolean;
  setCardOpen: (newState: boolean) => void;
  allFormInputs: { [key: string]: FormInput };
  categoryHash: { [key: string]: string };
  hideKey?: boolean;
  reference?: string;
  dependent?: boolean;
  parent?: string;
  mods?: Mods;
}

export type SectionType = FunctionComponent<SectionPropsType>;

export interface CardPropsType {
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
  allFormInputs: { [key: string]: FormInput };
  showObjectNameInput?: boolean;
  addProperties?: { [key: string]: any };
}

export type CardType = FunctionComponent<CardPropsType>;

// any non object type is a card
export type CardProps = {
  name: string;
  required: boolean;
  dataOptions: { [key: string]: any };
  uiOptions: { [key: string]: any };
  // only defined if a reference
  $ref?: string;
  // only defined if a dependency parent
  dependents?: Array<{
    children: Array<string>;
    value?: any;
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
  schema: { [key: string]: any };
  uischema: { [key: string]: any };
  // only defined if a reference
  $ref?: string;
  // only defined if a dependency parent
  dependents?: Array<{
    children: Array<string>;
    value?: any;
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

interface MatchType {
  types: Array<DataType>;
  widget?: string;
  field?: string;
  format?: string;
  $ref?: boolean;
  enum?: boolean;
}

export type CardComponentType = FunctionComponent<{
  parameters: CardComponentPropsType;
  onChange: (newParams: CardComponentPropsType) => void;
  mods?: Mods;
}>;

// an abstract input type
interface FormInputType {
  displayName: string;
  // given a data and ui schema, determine if the object is of this input type
  matchIf: Array<MatchType>;
  // allowed keys for ui:options
  possibleOptions?: Array<string>;
  defaultDataSchema: {
    [key: string]: any;
  };
  defaultUiSchema: {
    [key: string]: any;
  };
  // the data schema type
  type: DataType;
  // inputs on the preview card
  cardBody: CardComponentType;
  // inputs for the modal
  modalBody?: CardComponentType;
}

export interface DataOptions {
  title: string;
  type?: string;
  description?: string;
  $ref?: string;
  default?: string | number;
}

export interface ModLabels {
  formNameLabel?: string;
  formDescriptionLabel?: string;
  objectNameLabel?: string;
  displayNameLabel?: string;
  descriptionLabel?: string;
  inputTypeLabel?: string;
  addElementLabel?: string;
  addSectionLabel?: string;
}

// optional properties that can add custom features to the form builder
export interface Mods {
  customFormInputs?: {
    [key: string]: FormInputType;
  };
  components?: {
    add?: (properties?: {
      [key: string]: any;
    }) => ReactElement | ReactElement[] | [];
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
  newElementDefaultUiSchema?: { [key: string]: any };
}

export type FormInput = FormInputType;

export interface InitParameters {
  categoryHash?: { [key: string]: string };
}

export interface FormElement {
  name?: string;
  title?: string;
  description?: string;
  required?: boolean;
  $ref?: string;
  schema?: { [key: string]: any };
  uischema?: { [key: string]: any };
  propType?: string;
  dataOptions?: { [key: string]: any };
  uiOptions?: { [key: string]: any };
  type?: string;
  dependents?: { [key: string]: any };
  dependent?: boolean;
  parent?: string;
  neighborNames?: string[];
  children?: string[];
  value?: any;
}

export interface AddFormObjectParametersType {
  schema: { [key: string]: any };
  uischema: { [key: string]: any };
  mods?: Mods;
  onChange: (
    schema: { [key: string]: any },
    uischema: { [key: string]: any },
  ) => any;
  definitionData: { [key: string]: any };
  definitionUi: { [key: string]: any };
  index?: number;
  categoryHash: { [key: string]: string };
}

export interface DefinitionData {
  [key: string]: { 'ui:order'?: string[] };
}
