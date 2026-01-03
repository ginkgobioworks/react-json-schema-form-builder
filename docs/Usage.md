# Usage

## Dependencies

The React JSON Schema Form Builder uses [Material-UI (MUI)](https://mui.com/) for styling. Ensure that the required peer dependencies are installed:

```bash
npm i --save @mui/material @emotion/react @emotion/styled
```

## FormBuilder Component

The following example is a React component that maintains a Form Builder and stores the corresponding JSON schema as state variables.

```jsx
import React, { useState } from 'react';
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';

function Example() {
  const [schema, setSchema] = useState('{}');
  const [uischema, setUiSchema] = useState('{}');

  return (
    <FormBuilder
      schema={schema}
      uischema={uischema}
      onChange={(schema, uischema) => {
        setSchema(schema);
        setUiSchema(uischema);
      }}
    />
  );
}

export default Example;
```

### With React JSON Schema Form

Most likely, you will want to visually build the form with some preview of the rendered form available.

This will require you to use some implementation of the `Form` component from [RJSF](https://react-jsonschema-form.readthedocs.io/en/latest/). This example uses [@rjsf/core](https://www.npmjs.com/package/@rjsf/core) with the MUI theme:

```bash
npm i --save @rjsf/core @rjsf/mui @rjsf/validator-ajv8
```

The following example uses this form preview adjacent to the Form Builder:

```jsx
import React, { useState } from 'react';
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';
import { withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';

const Form = withTheme(MuiTheme);

function Example() {
  const [schema, setSchema] = useState('{}');
  const [uischema, setUiSchema] = useState('{}');
  const [formData, setFormData] = useState({});

  return (
    <div>
      <FormBuilder
        schema={schema}
        uischema={uischema}
        onChange={(schema, uischema) => {
          setSchema(schema);
          setUiSchema(uischema);
        }}
      />
      <Form
        schema={JSON.parse(schema)}
        uiSchema={JSON.parse(uischema)}
        onChange={(data) => setFormData(data.formData)}
        formData={formData}
        validator={validator}
      />
    </div>
  );
}

export default Example;
```

### With Definitions

JSON Schema forms also make use of definitions, allowing a form builder to define a component once and have several instances of that same component elsewhere within the schema. The `PredefinedGallery` component reads a whole JSON schema and allows a user to edit the `definitions` section. This is meant to be used in tandem with the `FormBuilder`, as follows:

```jsx
import React, { useState } from 'react';
import {
  FormBuilder,
  PredefinedGallery,
} from '@ginkgo-bioworks/react-json-schema-form-builder';

function Example() {
  const [schema, setSchema] = useState('{}');
  const [uischema, setUiSchema] = useState('{}');

  return (
    <div>
      <FormBuilder
        schema={schema}
        uischema={uischema}
        onChange={(schema, uischema) => {
          setSchema(schema);
          setUiSchema(uischema);
        }}
      />
      <PredefinedGallery
        schema={schema}
        uischema={uischema}
        onChange={(schema, uischema) => {
          setSchema(schema);
          setUiSchema(uischema);
        }}
      />
    </div>
  );
}

export default Example;
```

## Advanced

All types used in the advanced features below are exported from the package and can be imported for type safety. See the [Mods documentation](Mods.md) for a complete list of available types.

### Custom Form Inputs

In addition to the default types of form inputs (Time, Checkbox, Radio, Dropdown, Short Answer, Long Answer, Password, Integer, Number, Array), custom form inputs can also be specified. These form inputs are defined in a JS object that is passed into the `FormBuilder` component (and the `PredefinedGallery` component if it's being used) as part of a `mods` property, which has a comprehensive TypeScript type definition (`Mods`) that is exported from the package.

Key types for custom form inputs:
- `FormInput` - The type for a custom form input definition
- `Match` - Used in `FormInput.matchIf` to define matching criteria
- `DataType` - JSON Schema data types (`'string' | 'number' | 'boolean' | 'integer' | 'array' | 'object' | 'null'`)
- `CardComponent` - Type for `cardBody` and `modalBody` components
- `CardComponentProps` - Props passed to card and modal body components

#### Example Custom Form Input

This example demonstrates a Phone Number custom form input with country code selection and validation pattern configuration:

```jsx
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import type {
  FormInput,
  Match,
  DataType,
  CardComponent,
  CardComponentProps,
} from '@ginkgo-bioworks/react-json-schema-form-builder';

const phoneNumberFormInput: FormInput = {
  displayName: 'Phone Number',
  matchIf: [
    {
      types: ['string'],
      widget: 'phone',
    },
  ],
  defaultDataSchema: {
    type: 'string',
    pattern: '^\\+?[1-9]\\d{1,14}$', // E.164 format
  },
  defaultUiSchema: {
    'ui:widget': 'phone',
    'ui:placeholder': '+1234567890',
  },
  type: 'string',
  cardBody: ({ parameters, onChange }) => {
    const defaultValue =
      typeof parameters.default === 'string' ? parameters.default : '';
    const countryCode = (parameters as any).countryCode || '+1';
    const phoneNumber = defaultValue.replace(/^\+?\d{1,3}/, '') || '';

    return (
      <>
        <Typography variant='subtitle2' gutterBottom>
          Default Phone Number
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            select
            value={countryCode}
            onChange={(ev) => {
              const newCode = ev.target.value;
              const newParams: CardComponentProps = {
                ...parameters,
                default: `${newCode}${phoneNumber}`,
              };
              (newParams as any).countryCode = newCode;
              onChange(newParams);
            }}
            size='small'
            sx={{ minWidth: 120 }}
          >
            <MenuItem value='+1'>+1 (US)</MenuItem>
            <MenuItem value='+44'>+44 (UK)</MenuItem>
            <MenuItem value='+33'>+33 (FR)</MenuItem>
            <MenuItem value='+49'>+49 (DE)</MenuItem>
            <MenuItem value='+81'>+81 (JP)</MenuItem>
          </TextField>
          <TextField
            value={phoneNumber}
            placeholder='1234567890'
            onChange={(ev) => {
              const newParams: CardComponentProps = {
                ...parameters,
                default: `${countryCode}${ev.target.value}`,
              };
              (newParams as any).countryCode = countryCode;
              onChange(newParams);
            }}
            size='small'
            fullWidth
          />
        </Box>
      </>
    );
  },
  modalBody: ({ parameters, onChange }) => (
    <>
      <Typography variant='subtitle2' gutterBottom>
        Phone Number Configuration
      </Typography>
      <TextField
        label='Validation Pattern (regex)'
        value={parameters.pattern || '^\\+?[1-9]\\d{1,14}$'}
        placeholder='^\\+?[1-9]\\d{1,14}$'
        onChange={(ev) => onChange({ ...parameters, pattern: ev.target.value })}
        size='small'
        fullWidth
        sx={{ mb: 2 }}
        helperText='E.164 format: + followed by country code and number'
      />
      <Typography variant='caption' color='text.secondary'>
        Customize the validation pattern for phone number format
      </Typography>
    </>
  ),
};

const customFormInputs = {
  phone: phoneNumberFormInput,
};
```

This can then be passed into an app using the `FormBuilder` as follows:

```jsx
import React, { useState } from 'react';
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';

function Example() {
  const [schema, setSchema] = useState('{}');
  const [uischema, setUiSchema] = useState('{}');

  return (
    <FormBuilder
      schema={schema}
      uischema={uischema}
      onChange={(schema, uischema) => {
        setSchema(schema);
        setUiSchema(uischema);
      }}
      mods={{
        customFormInputs,
      }}
    />
  );
}

export default Example;
```

The `customFormInputs` define the logic that translates abstract "Input Types" into raw data schema and UI schema. For more information about these Custom Form Inputs, see the page [here](Mods.md).

The `tooltipDescriptions` allows an implementation of the `FormBuilder` that changes the tooltip descriptions that appear on hover over certain areas of the tool. The `add` popup appears when hovering over the plus buttons, the `cardObjectName` is the name of the back end name that appears in every card object input, the `cardDisplayName` allows rewriting the description of the display name tooltip, the `cardDescription` option allows overwriting the tooltip for the description, and the `cardInputType` allows setting a custom tooltip for the Input Type dropdown.

### Deactivated Form Inputs

It is also possible to deactivate (hide) certain Input Types by setting the `deactivatedFormInputs` property on mods. For example, to hide the `time` and `checkbox` form inputs that are usually included by default, you may set the mods to:

```javascript
const mods = {
  deactivatedFormInputs: ['time', 'checkbox'],
};
```

This will hide these Input Types on the `FormBuilder` component.

### Default New Form Element (newElementDefaultDataOptions and newElementDefaultUiSchema)

By default, when adding a new form element, the schema for the new form element is set to:

```javascript
{
  title: `New Input ${i}`,
  type: 'string',
  default: '',
}
```

and the UI schema is not set at all. This means that by default, a new form element has the "Short answer" input type. If you wish to override this (for example, if the "Short answer" input is deactivated), you can do so by using the `newElementDefaultDataOptions` and `newElementDefaultUiSchema` mods. The `DataOptions` type is exported and can be imported from the package:

```typescript
import type { DataOptions } from '@ginkgo-bioworks/react-json-schema-form-builder';

const mods = {
  newElementDefaultDataOptions: {
    $ref: '#/definitions/firstNames',
    title: 'Field',
  } as DataOptions,
};
```

This will default new form elements to a "Reference" type to some definition "firstNames" defined in the schema. Setting the mods to the following:

```javascript
const mods = {
  newElementDefaultUiSchema: {
    'ui:widget': 'customWidget',
  },
};
```

will set the UI schema for a new element to use the `customWidget` widget.

### Customizing "Add" buttons

This form builder includes a button to add new form elements or sections (the button with a + symbol). In some cases you may want to modify this feature or provide custom button components. There are a few options to customize this component.

#### **1. Custom Labels**

One simple way to provide customization is to change the labels for "Add form element" and "Add form section". You can update these labels with the following mods:

```javascript
const mods = {
  labels: {
    addElementLabel: 'my element label',
    addSectionLabel: 'my section label',
  },
};
```

#### **2. Invoking the "add" functions**

You can invoke the following two functions anywhere in your app in order to add form elements and/or sections within the Form Builder component:

```javascript
import {
  addCardObj,
  addSectionObj,
} from '@ginkgo-bioworks/react-json-schema-form-builder';
```

Both of these functions require the following properties. The `AddFormObjectParameters` type is exported and can be imported from the package:

```typescript
import type {
  AddFormObjectParameters,
  DefinitionData,
  JsonSchema,
  UiSchema,
  UiSchemaProperty,
  Mods,
} from '@ginkgo-bioworks/react-json-schema-form-builder';

// The type definition:
type AddFormObjectParameters = {
  schema: JsonSchema | Record<string, unknown>;
  uischema: UiSchema | Record<string, unknown>;
  mods?: Mods;
  onChange: (schema: JsonSchema | Record<string, unknown>, uischema: UiSchema | Record<string, unknown>) => unknown;
  definitionData: DefinitionData;
  definitionUi: Record<string, UiSchemaProperty>;
  index?: number;
  categoryHash: Record<string, string>;
};
```

The `categoryHash` helps FormBuilder match input types and is generated by FormBuilder upon rendering. You can get the generated hash through the `onMount` callback. The `InitParameters` type is exported and can be imported for type safety:

```typescript
import type { InitParameters } from '@ginkgo-bioworks/react-json-schema-form-builder';

// The onMount callback receives InitParameters
const handleMount = (params: InitParameters) => {
  // params.categoryHash is available here
  setCategoryHash(params.categoryHash);
};
```

Example:

```jsx
import type { InitParameters } from '@ginkgo-bioworks/react-json-schema-form-builder';

<FormBuilder
  // ...
  onMount={(params: InitParameters) => {
    // Here you can save categoryHash to props or state
    setCategoryHash(params.categoryHash || '');
  }}
/>
```

#### **3. Overriding the "Add" component**

By providing a custom component through `mods`, you can completely override the `Add` component.

To do this, provide a callback function to the `components.add` mod. This callback should expect one argument of type `AddFormObjectParameters`, which provides properties that are required to add elements and sections to the form builder. The type is exported and can be imported from the package:

```jsx
import {
  addCardObj,
  type AddFormObjectParameters,
} from '@ginkgo-bioworks/react-json-schema-form-builder';
import Button from '@mui/material/Button';

const mods = {
  components: {
    add: (properties: AddFormObjectParameters) => (
      <Button onClick={() => addCardObj(properties)}>Add Element</Button>
    ),
  },
};
```

Putting it all together, the following snippet is an example showing two fully functioning buttons:

```jsx
import React, { useState } from 'react';
import {
  FormBuilder,
  addCardObj,
  addSectionObj,
} from '@ginkgo-bioworks/react-json-schema-form-builder';
import type {
  AddFormObjectParameters,
  InitParameters,
  JsonSchema,
  UiSchema,
} from '@ginkgo-bioworks/react-json-schema-form-builder';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function MyFormBuilder() {
  const [schema, setSchema] = useState<JsonSchema>({});
  const [uiSchema, setUiSchema] = useState<UiSchema>({});
  const [categoryHash, setCategoryHash] = useState('');

  const mods = {
    components: {
      add: (addProps: AddFormObjectParameters) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => addCardObj(addProps)}
          >
            Add Form Element
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => addSectionObj(addProps)}
          >
            Add Form Section
          </Button>
        </Stack>
      ),
    },
  };

  return (
    <FormBuilder
      schema={JSON.stringify(schema)}
      uischema={JSON.stringify(uiSchema)}
      mods={mods}
      onChange={(schema, uischema) => {
        setSchema(JSON.parse(schema));
        setUiSchema(JSON.parse(uischema));
      }}
      onMount={(params: InitParameters) => {
        setCategoryHash(params.categoryHash || '');
      }}
    />
  );
}

export default MyFormBuilder;
```

### Styling

The Form Builder uses Material-UI (MUI) components for consistent styling. You can customize the appearance by:

1. **Theme customization**: Wrap your app with MUI's `ThemeProvider` to apply custom themes to all MUI components used within the FormBuilder and PredefinedGallery

2. **Component overrides**: Use MUI's theme component overrides for global style changes to specific MUI components

3. **className prop**: Both `FormBuilder` and `PredefinedGallery` components accept a `className` prop that can be used to apply custom CSS classes to their root containers

```jsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  components: {
    // Override MUI component styles globally
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <FormBuilder
        schema={schema}
        uischema={uischema}
        onChange={onChange}
        className="my-custom-form-builder"
      />
      <PredefinedGallery
        schema={schema}
        uischema={uischema}
        onChange={onChange}
        className="my-custom-predefined-gallery"
      />
    </ThemeProvider>
  );
}
```

**Styling Notes:**
- Both `FormBuilder` and `PredefinedGallery` components accept a `className` prop for custom CSS classes
- Neither component accepts an `sx` prop directly
- Both components can be styled via MUI `ThemeProvider` and theme component overrides
- Use `className` on both components or MUI theme customization for styling changes
