# Mods

Mods provide for the customization of the Form Builder component, such as the definition of custom input types.

## Type Definition

Flow type definitions are available via [flow-typed](https://github.com/flow-typed/flow-typed).

The type definition for Mods is as follows:

```react
declare type Mods = {|
  customFormInputs?: {
    [string]: FormInput,
    ...
  },
  tooltipDescriptions?: {|
    add?: string,
    cardObjectName?: string,
    cardDisplayName?: string,
    cardDescription?: string,
    cardInputType?: string,
    cardSectionObjectName?: string,
    cardSectionDisplayName?: string,
    cardSectionDescription?: string,
  |},
  labels?: {|
    formNameLabel?: string,
    formDescriptionLabel?: string,
    objectNameLabel?: string,
    displayNameLabel?: string,
    descriptionLabel?: string,
    inputTypeLabel?: string,
  |},
  showFormHead?: boolean,
  deactivatedFormInputs?: Array<string>,
  newElementDefaultDataOptions?: {
    title: string,
    type?: string,
    description?: string,
    $ref?: string,
    default?: string,
  },
  newElementDefaultUiSchema?: { [string]: any },
|};
```

`tooltipDescriptions` and `labels` describe how some of the labels and tooltips in the Form Builder are to be customized. `showFormHead` is a boolean which controls whether the top section of the Form Builder, which contains inputs for the Form Name and Form Description, are show. It is set to `true` by default.

A single `FormInput` has a type definition as follows:

```react
declare type FormInput = {|
  displayName: string,
  // given a data and ui schema, determine if the object is of this input type
  matchIf: Array<MatchType>,
  // allowed keys for ui:options
  possibleOptions?: Array<string>,
  defaultDataSchema: {
    [string]: any,
    ...
  },
  defaultUiSchema: {
    [string]: any,
    ...
  },
  // the data schema type
  type: DataType,
  // inputs on the preview card
  cardBody: React$ComponentType<CardBodyProps>,
  // inputs for the modal
  modalBody?: React$ComponentType<CardBodyProps>,
  |};
```

The `displayName` is the full name of the desired form input. For example, **Short Answer** is the `displayName` for the `shortAnswer` form input.

`matchIf` is an array of scenarios that will cause the `FormBuilder` to recognize a piece of Data and UI schema as this custom input type. For more information, see the *Matching Algorithm* section on this page.

`possibleOptions` is the set of possible values that can appear after `ui:option` in the UI schema for this component.

`defaultDataSchema` is the data schema that gets filled into the component when a user switches to this input type. This default data schema must be a match in the `matchIf` array, or otherwise when the user switches to the Input Type, it will be immediately unrecognzied and instead be captured by the next applicable input type.

`defaultUiSchema` is the ui schema that gets filled into the component when a user switches to this input type. It functions similarly to the `defaultDataSchema`, and must pass the requirements in `matchIf`.

`type` is the Data Schema type that this input type defaults to. While a custom form input can have multiple types (would need to be defined in the `matchIf` array), this refers to the type that gets assigned immediately after a user selects this input type in the dropdown. The possible `DataType` options supported by `react-jsonschema-form` are as follows:

```react
declare type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'integer'
  | 'array'
  | 'object'
  | 'null';
```

`cardBody` refers to a React component that gets rendered in the card itself, when expanded. This React component gets a set of `Parameters` that provide additional information about the FormInput, such as the `title` or the `default` properties. For more information, see the *Parameters* section.

`cardModal` refers to the React component that appears inside the modal that appears when the form builder clicks on the pencil icon. This React component also receives the same `Parameters` object, which is explained in further detail in the *Parameters* section.

The `FormBuilder` component takes a prop `mods`, which is a `Mods` type object.

## Custom Form Inputs

The documentation on the [Background](Background.md) of the Form Builder lists the set of input types supported by default, but for different use cases, the `FormBuilder` may be more useful to Form Builders if certain custom types can be inserted. This allows, for example, the definition of an input type that is associated with specific code in ui schema or data schema.

One example is the `Time` input type - it is a string type element in JSON schema, but is associated with the `format: date-time` property in the data schema at all times. This means that whenever a `Time` Input type is defined by a form builder, it is rendered accordingly by whatever form rendering software is used (`react-jsonschema-form`, for example, renders this as an input line that only allows time value to be entered).

Custom input types are encoded in exactly the same way the Default input types are encoded, and the Default input types are all available in the `default` directory [here](https://github.com/ginkgobioworks/react-json-schema-form-builder/tree/main/src/formBuilder/defaults).

### Matching Algorithm

The `matchIf` array in a `FormInput` contains a series of `MatchType` objects, which represent different possible 'scenarios' that the `FormBuilder` may encounter when parsing a set of Data and UI Schema. The `MatchType` is defined as follows:

```react
declare type MatchType = {|
  types: Array<DataType>,
  widget?: string,
  field?: string,
  format?: string,
  $ref?: boolean,
  enum?: boolean,
|};
```

`types` refers to the set of possible input types that can register in a particular scenario.

`widget` is the value for the key `ui:widget` that can exist in the UI schema for this scenario.

`field` is the value for the key `ui:field` that can exist in the UI schema for this scenario.

`format` is the value for the key `format` that can exist in the Data schema for this scenario.

`$ref` is a boolean that evaluates to true if, in this scenario, the input type is a reference to a field in `definitions` in the Data Schema (in other words, the data schema has a property `$ref`).

`enum` is a boolean that evaluates to true if the component has a property `enum` in the Data Schema.

### Component Types

`cardBody` and `modalBody` are components whose props have a type of `CardBodyProps`:

```react
declare export type CardBodyProps = {|
  parameters: Parameters,
  onChange: (newParams: Parameters) => void,
|};
```

`Parameters` is defined as:

```react
declare type Parameters = {|
  [string]: any,
  name: string,
  path: string,
  definitionData: { [string]: any, ... },
  definitionUi: { [string]: any, ... },
  category: string,
  'ui:option': { [string]: any, ... },
|};
```

It can hold any number of keys pointing to specific values. One common example is `parameters.default`, which stores the default value specified by the builder for this `FormInput`.

## Tooltips and Labels

By passing in alternative text to the `tooltipDescriptions` object of the `mods` prop, the text for various tooltips in the Form Builder can be customized:

- `add` - The tooltip when hovering over the button to add a new element/section.
- `cardObjectName` - The tooltip for the "Object Name" field for a form element.
- `cardDisplayName` - The tooltip for the "Display Name" field for a form element.
- `cardDescription` - The tooltip for the "Description" field for a form element.
- `cardInputType` - The tooltip for the "Input Type" field for a form element.
- `cardSectionObjectName` - The tooltip for the "Object Name" field for a form section.
- `cardSectionDisplayName` - The tooltip for the "Display Name" field for a form section.
- `cardSectionDescription` - The tooltip for the "Description" field for a form section.

The text for the labels of a few of the inputs in the Form Builder can similarly be customized by specifying a `labels` object of `mods`.

- `formNameLabel` - The label for the input for the name/title of the entire form.
- `formDescriptionLabel` - The label for the input for the description of the entire form.
- `objectNameLabel` - The label for the "Object Name" field.
- `displayNameLabel` - The label for the "Display Name" field.
- `descriptionLabel` - The label for the "Description" field.
- `inputTypeLabel` - The label for the "Input Type" field.
