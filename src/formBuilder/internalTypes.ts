/**
 * Internal Types
 *
 * These types are used internally by the FormBuilder implementation.
 * They are NOT part of the public API and should not be imported by users of the library.
 */

import { FunctionComponent } from 'react';
import type {
  JsonSchema,
  JsonSchemaProperty,
  UiSchema,
  UiSchemaProperty,
  CardComponentProps,
  Mods,
  FormInput,
  AddFormObjectParameters,
  DefinitionData,
} from './publicTypes';

// Input select data type for internal use
export type InputSelectData = {
  $ref: string;
  title: string;
  default: string;
  type: string;
  category: string;
};

// Card modal props (internal component - not exported, only used to define CardModal)
type CardModalProps = {
  componentProps: CardComponentProps;
  onChange: (arg0: CardComponentProps) => void;
  isOpen: boolean;
  onClose: () => void;
  TypeSpecificParameters: FunctionComponent<{
    parameters: CardComponentProps;
    onChange: (newParams: CardComponentProps) => void;
  }>;
};

export type CardModal = FunctionComponent<CardModalProps>;

// Section component props (internal)
export type SectionProps = {
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
  parentProperties: AddFormObjectParameters;
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

export type Section = FunctionComponent<SectionProps>;

// Card component props (internal)
// Note: This is different from CardProps which is used for parsing
export type CardComponentPropsInternal = {
  componentProps: CardComponentProps;
  onChange: (newParams: CardComponentProps) => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  TypeSpecificParameters: FunctionComponent<{
    parameters: CardComponentProps;
    onChange: (newParams: CardComponentProps) => void;
  }>;
  addElem?: (choice: string) => void;
  cardOpen: boolean;
  setCardOpen: (newState: boolean) => void;
  mods?: Mods;
  allFormInputs: Record<string, FormInput>;
  showObjectNameInput?: boolean;
  addProperties?: AddFormObjectParameters;
};

export type Card = FunctionComponent<CardComponentPropsInternal>;

// Card props (internal parsing types)
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

// Section props (internal parsing types - not exported, only used in ElementProps)
type SectionPropsInternal = {
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

// The most generic form element (internal)
export type ElementProps = CardProps & SectionPropsInternal;

// Form element type (internal)
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
