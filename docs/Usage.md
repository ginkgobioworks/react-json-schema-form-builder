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

### Custom Form Inputs

In addition to the default types of form inputs (Time, Checkbox, Radio, Dropdown, Short Answer, Long Answer, Password, Integer, Number, Array), custom form inputs can also be specified. These form inputs are defined in a JS object that is passed into the `FormBuilder` component (and the `PredefinedGallery` component if it's being used) as part of a `mods` property, which has a comprehensive type definition in [src/formBuilder/types.ts](https://github.com/ginkgobioworks/react-json-schema-form-builder/blob/main/src/formBuilder/types.ts) as `Mods`.

#### Example Custom Form Input

```jsx
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const customFormInputs = {
  email: {
    displayName: 'Email',
    matchIf: [
      {
        types: ['string'],
        widget: 'email',
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {
      'ui:widget': 'email',
    },
    type: 'string',
    cardBody: ({ parameters, onChange }) => (
      <div>
        <Typography variant="subtitle2">Default email</Typography>
        <TextField
          value={parameters.default || ''}
          placeholder="Default"
          type="email"
          onChange={(ev) =>
            onChange({ ...parameters, default: ev.target.value })
          }
          size="small"
          fullWidth
        />
      </div>
    ),
    modalBody: ({ parameters, onChange }) => (
      <>Extra editing options in modal appear here</>
    ),
  },
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

and the UI schema is not set at all. This means that by default, a new form element has the "Short answer" input type. If you wish to override this (for example, if the "Short answer" input is deactivated), you can do so by using the `newElementDefaultDataOptions` and `newElementDefaultUiSchema` mods. For example, setting the mods to the following:

```javascript
const mods = {
  newElementDefaultDataOptions: {
    $ref: '#/definitions/firstNames',
    title: 'Field',
  },
};
```

will default new form elements to a "Reference" type to some definition "firstNames" defined in the schema. Setting the mods to the following:

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

Both of these functions require the following properties:

```typescript
type properties = {
  schema: object; // FormBuilder schema
  uischema: object; // FormBuilder uiSchema
  mods: object; // FormBuilder mods
  onChange: (schema: string, uischema: string) => void;
  definitionData: string; // see: schema.definitions
  definitionUi: string; // see: uischema.definitions
  categoryHash: string[]; // see: FormBuilder.onMount()
};
```

The `categoryHash` helps FormBuilder match input types and is generated by FormBuilder upon rendering. You can get the generated hash through the `onMount` callback.

Example:

```jsx
<FormBuilder
  // ...
  onMount={({ categoryHash }) => {
    // Here you can save categoryHash to props or state
    setCategoryHash(categoryHash);
  }}
/>
```

#### **3. Overriding the "Add" component**

By providing a custom component through `mods`, you can completely override the `Add` component.

To do this, provide a callback function to the `components.add` mod. This callback should expect one argument, which provides properties that are required to add elements and sections to the form builder.

```jsx
import { addCardObj } from '@ginkgo-bioworks/react-json-schema-form-builder';
import Button from '@mui/material/Button';

const mods = {
  components: {
    add: (properties) => (
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
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function MyFormBuilder() {
  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});
  const [categoryHash, setCategoryHash] = useState('');

  const mods = {
    components: {
      add: (addProps) => (
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
      onMount={({ categoryHash }) => {
        setCategoryHash(categoryHash);
      }}
    />
  );
}

export default MyFormBuilder;
```

### Styling

The Form Builder uses Material-UI (MUI) components for consistent styling. You can customize the appearance by:

1. **Theme customization**: Wrap your app with MUI's `ThemeProvider` to apply custom themes
2. **Component overrides**: Use MUI's theme component overrides for global style changes
3. **sx prop**: Use MUI's `sx` prop for one-off style customizations

```jsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <FormBuilder {...props} />
    </ThemeProvider>
  );
}
```
