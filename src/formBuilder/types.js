// @flow
import * as React from 'react';

// any non object type is a card
export type CardProps = {
  name: string,
  required: boolean,
  dataOptions: { [string]: any },
  uiOptions: { [string]: any },
  // only defined if a reference
  $ref?: string,
  // only defined if a dependency parent
  dependents?: Array<{
    children: Array<string>,
    value?: any,
  }>,
  // true if dependent on another card
  dependent?: boolean,
  parent?: string,
  // either 'section' or 'card'
  propType: string,
  neighborNames: Array<string>,
};

// object type elements are sections
export type SectionProps = {
  name: string,
  required: boolean,
  schema: { [string]: any },
  uischema: { [string]: any },
  // only defined if a reference
  $ref?: string,
  // only defined if a dependency parent
  dependents?: Array<{
    children: Array<string>,
    value?: any,
  }>,
  // true if dependent on another card
  dependent?: boolean,
  // either 'section' or 'card'
  propType: string,
  neighborNames: Array<string>,
};

// the most generic form element
export type ElementProps = CardProps & SectionProps;

// parameters passed between card instances
export type Parameters = {
  [string]: string | number | boolean | Array<string | number>,
  name: string,
  path: string,
  definitionData: { [string]: any },
  definitionUi: { [string]: any },
  category: string,
  'ui:option': { [string]: any },
};

type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'integer'
  | 'array'
  | '*'
  | null;

type MatchType = {
  types: Array<DataType>,
  widget?: string,
  field?: string,
  option?: { [string]: any },
  format?: string,
  $ref?: boolean,
  enum?: boolean,
};

// an abstract input type
export type FormInput = {
  displayName: string,
  // given a data and ui schema, determine if the object is of this input type
  matchIf: Array<MatchType>,
  // allowed keys for ui:options
  possibleOptions?: Array<string>,
  defaultDataSchema: {
    [string]: any,
  },
  defaultUiSchema: {
    [string]: any,
  },
  // the data schema type
  type: DataType,
  // inputs on the preview card
  cardBody: React.AbstractComponent<{
    parameters: Parameters,
    onChange: (newParams: Parameters) => void,
    mods: { [string]: any },
  }>,
  // inputs for the modal
  modalBody?: React.AbstractComponent<{
    parameters: Parameters,
    onChange: (newParams: Parameters) => void,
  }>,
};

// optional properties that can add custom features to the form builder
export type Mods = {
  customFormInputs?: {
    [string]: FormInput,
  },
  customComponents?: {
    button?: React.AbstractComponent<{
      onClick: () => void,
      color: string,
    }>,
    checkbox?: React.AbstractComponent<{
      onChange: () => void,
      isChecked: boolean,
      label: string,
      id: string,
    }>,
  },
  tooltipDescriptions?: {
    add?: string,
    cardObjectName?: string,
    cardDisplayName?: string,
    cardDescription?: string,
    cardInputType?: string,
  },
};
