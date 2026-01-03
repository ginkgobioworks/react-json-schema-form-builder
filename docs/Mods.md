# Mods

Mods provide for the customization of the Form Builder component, such as the definition of custom input types.

## Type Definition

All types used in mods are exported from the package and can be imported directly. When you import types from the package, TypeScript automatically provides type checking.

```typescript
import type {
  Mods,
  FormInput,
  Match,
  CardComponent,
  CardComponentProps,
  ModLabels,
  DataOptions,
  AddFormObjectParameters,
  DefinitionData,
  DataType,
  JsonSchemaProperty,
  UiSchemaProperty,
} from '@ginkgo-bioworks/react-json-schema-form-builder';
```

### Mods

The `Mods` type is the main interface for customizing the Form Builder. It includes:

- `customFormInputs?: Record<string, FormInput>` - Define custom form input types
- `components?: { add?: (properties?: AddFormObjectParameters) => ReactElement | ReactElement[] | [] }` - Customize the "Add" button component
- `tooltipDescriptions?: { ... }` - Customize tooltip text (see [Tooltips and Labels](#tooltips-and-labels) section)
- `labels?: ModLabels` - Customize label text (see [Tooltips and Labels](#tooltips-and-labels) section)
- `showFormHead?: boolean` - Control visibility of the form header (default: `true`)
- `deactivatedFormInputs?: Array<string>` - Hide specific default input types
- `newElementDefaultDataOptions?: DataOptions` - Set default options for new form elements
- `newElementDefaultUiSchema?: UiSchemaProperty | Record<string, unknown>` - Set default UI schema for new form elements

**Additional types:**
- `AddFormObjectParameters` - Used in `components.add` callback to add form elements programmatically (see [Usage documentation](Usage.md#customizing-add-buttons) for details)
- `DataOptions` - Type for `newElementDefaultDataOptions`, includes `title`, `type`, `description`, `$ref`, and `default` properties

### FormInput

The `FormInput` type defines a custom form input. Key properties:

- `displayName: string` - The full name shown in the Input Type dropdown (e.g., "Short Answer")
- `matchIf: Array<Match>` - Array of matching criteria to identify this input type (see [Matching Algorithm](#matching-algorithm) section)
- `possibleOptions?: Array<string>` - Allowed keys for `ui:options` in the UI schema
- `defaultDataSchema: JsonSchemaProperty | Record<string, unknown>` - Default data schema when switching to this input type (must match one of the `matchIf` criteria)
- `defaultUiSchema: UiSchemaProperty | Record<string, unknown>` - Default UI schema when switching to this input type (must match one of the `matchIf` criteria)
- `type: DataType` - The JSON Schema data type (see `DataType` below)
- `cardBody: CardComponent` - React component rendered in the expanded card
- `modalBody?: CardComponent` - Optional React component rendered in the modal (pencil icon)

### DataType

The `DataType` is a union type representing JSON Schema data types supported by `react-jsonschema-form`:

```typescript
type DataType = 'string' | 'number' | 'boolean' | 'integer' | 'array' | 'object' | 'null';
```

The `FormBuilder` component takes a prop `mods`, which is a `Mods` type object.

## Custom Form Inputs

The documentation on the [Background](Background.md) of the Form Builder lists the set of input types supported by default, but for different use cases, the `FormBuilder` may be more useful to Form Builders if certain custom types can be inserted. This allows, for example, the definition of an input type that is associated with specific code in ui schema or data schema.

One example is the `Time` input type - it is a string type element in JSON schema, but is associated with the `format: date-time` property in the data schema at all times. This means that whenever a `Time` Input type is defined by a form builder, it is rendered accordingly by whatever form rendering software is used (`react-jsonschema-form`, for example, renders this as an input line that only allows time value to be entered).

Custom input types are encoded in exactly the same way the Default input types are encoded, and the Default input types are all available in the `default` directory [here](https://github.com/ginkgobioworks/react-json-schema-form-builder/tree/main/src/formBuilder/defaults).

### Matching Algorithm

The `matchIf` array in a `FormInput` contains a series of `Match` objects, which represent different possible 'scenarios' that the `FormBuilder` may encounter when parsing a set of Data and UI Schema. The `Match` type is exported and can be imported from the package.

**Match properties:**

- `types: Array<DataType>` - The set of possible JSON Schema data types that can register in this scenario
- `widget?: string` - The value for `ui:widget` that can exist in the UI schema for this scenario
- `field?: string` - The value for `ui:field` that can exist in the UI schema for this scenario
- `format?: string` - The value for `format` that can exist in the Data schema for this scenario
- `$ref?: boolean` - If `true`, matches when the data schema has a `$ref` property (reference to a definition)
- `enum?: boolean` - If `true`, matches when the data schema has an `enum` property

Import the type from the package to see its complete definition.

### Component Types

`cardBody` and `modalBody` are components whose props have a type of `CardComponent`. Both `CardComponent` and `CardComponentProps` are exported and can be imported from the package.

**CardComponent** is a React function component that receives:
- `parameters: CardComponentProps` - The props/parameters for the form input
- `onChange: (newParams: CardComponentProps) => void` - Callback to update the parameters
- `mods?: Mods` - Optional mods configuration

**CardComponentProps** describes the parameters passed to card and modal components. It includes properties such as:
- Form element properties: `name`, `title`, `description`, `required`, `type`
- JSON Schema validation: `minLength`, `maxLength`, `pattern`, `minimum`, `maximum`, `enum`, etc.
- UI Schema properties: `ui:options`, `ui:placeholder`, `ui:autofocus`, `ui:autocomplete`, etc.
- Dependencies: `dependents`, `dependent`, `parent`
- References: `$ref`, `definitionData`, `definitionUi`

Import the types from the package to see their complete definitions.

One common example is the `default` property, which stores the default value specified by the builder for this `FormInput`.

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
- `addElementLabel` - The label for the popover option when adding a new form element.
- `addSectionLabel` - The label for the popover option when adding a new form section.
