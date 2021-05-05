# Usage

## Dependencies

As the peer dependencies indicate, the React JSON Schema Form Builder depends on the [bootstrap](https://www.npmjs.com/package/bootstrap) package. Ensure that it is installed in your app, and include the stylesheet by importing it in the main module of your app:

```react
import 'bootstrap/dist/css/bootstrap.min.css';
```

## FormBuilder Component

The following example is a React component that simply maintains a Form Builder and stores the corresponding JSON schema as state variables, instead of rendering them in any way.

```react
import React, { Component } from 'react';

import {FormBuilder} from 'react-json-schema-form-builder';

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: '{}',
      uischema: '{}'
    };
  }
  render() {
    return (
      <FormBuilder
        schema={this.state.schema}
        uischema={this.state.uischema}
        onChange={(newSchema: string, newUiSchema: string) => {
          this.setState({
            schema: newSchema,
            uischema: newUiSchema
          })
        }}
      />
    );
  }
}
```

### With React JSON Schema Form

Most likely, you will want to visually build the form with some preview of the rendered form available.

This will require you to use some implementation of the `Form` component from [RJSF](https://react-jsonschema-form.readthedocs.io/en/latest/).  React component to render the JSON schema as a form. This example uses [@rjsf/core](https://www.npmjs.com/package/@rjsf/core):

``` bash
npm i --save @rjsf/core
```

The following example uses this form preview adjacent to the Form Builder:

``` react
import React, { Component } from 'react';

import {FormBuilder} from 'react-json-schema-form-builder';
import Form from '@rjsf/core';

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: '{}',
      uischema: '{}',
      formData: {}
    };
  }
  render() {
    return (
      <div>
        <FormBuilder
          schema={this.state.schema}
          uischema={this.state.uischema}
          onChange={(newSchema: string, newUiSchema: string) => {
            this.setState({
              schema: newSchema,
              uischema: newUiSchema
            })
          }}
        />
        <Form
          schema={JSON.parse(this.state.schema)}
          uiSchema={JSON.parse(this.state.uischema)}
          onChange={(newFormData) => this.setState(formData: newFormData.formData)}
          formData={this.state.formData}
          submitButtonMessage={"Submit"}
        />
      </div>
    );
  }
}
```

### With Definitions

JSON Schema forms also make use of definitions, allowing a form builder to define a component once and have several instances of that same component elsewhere within the schema. The `PredefinedGallery` component reads a whole JSON schema and allows a user to edit the `definitions` section. This is meant to be used in tandem with the `FormBuilder`, as follows:

``` react
import React, { Component } from 'react';

import {FormBuilder, PredefinedGallery} from "@ginkgo-bioworks/react-json-schema-form-builder";

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: '{}',
      uischema: '{}'
    };
  }
  render() {
    return (
      <div>
        <FormBuilder
          schema={this.state.schema}
          uischema={this.state.uischema}
          onChange={(newSchema: string, newUiSchema: string) => {
            this.setState({
              schema: newSchema,
              uischema: newUiSchema
            })
          }}
        />
      	<PredefinedGallery
          schema={this.state.schema}
          uischema={this.state.uischema}
          onChange={(newSchema: string, newUiSchema: string) => {
            this.setState({
              schema: newSchema,
              uischema: newUiSchema
            })
          }}
        />
      </div>
    );
  }
}
```

### Function Hook Example

The following is an example that implements the `FormBuilder` in a React function hook:

``` react
import * as React from 'react';

import {FormBuilder, PredefinedGallery} from "@ginkgo-bioworks/react-json-schema-form-builder";

export default function Example() {
  const [schema, setSchema] = React.useState('{}');
  const [uischema, setUiSchema] = React.useState('{}');
  return (
      <div>
        <FormBuilder
          schema={schema}
          uischema={uischema}
          onChange={(newSchema: string, newUiSchema: string) => {
            setSchema(newSchema);
            setUiSchema(newUiSchema)
          }}
        />
      	<PredefinedGallery
          schema={schema}
          uischema={uischema}
          onChange={(newSchema: string, newUiSchema: string) => {
            setSchema(newSchema);
            setUiSchema(newUiSchema)
          }}
        />
      </div>
    );
}
```

## Advanced

### Custom Form Inputs

In addition to the default types of form inputs (Time, Checkbox, Radio, Dropdown, Short Answer, Long Answer, Password, Integer, Number, Array), custom form inputs can also be specified. These form inputs are defined in a JS object that is passed into the `FormBuilder` component (and the `PredefinedGallery` component if it's being used) as part of a `mods` property, which has a comprehensive type definition in [src/formBuilder/types.js](https://github.com/ginkgobioworks/react-json-schema-form-builder/blob/main/src/formBuilder/types.js) as `Mods`.

#### Example Custom Form Input

```react
const customFormInputs = {
  shortAnswer: {
    displayName: "Email",
    matchIf: [
      {
        types: ["string"],
        widget: "email"
      },
    ],
    defaultDataSchema: {},
    defaultUiSchema: {
      "ui:widget": "password"
    },
    type: "string",
    cardBody: (parameters, onChange) => <div>
      <h5>Default email</h5>
      <input
        value={parameters.default}
        placeholder="Default"
        type="text"
        onChange={(ev: SyntheticInputEvent<HTMLInputElement>) =>
          onChange({ ...parameters, default: ev.target.value })
        }
      />
    </div>,
    modalBody: (parameters, onChange) => <div>
      Extra editing options in modal appear hear
    </div>,
  },
};

```

This can then be passed into an app using the `FormBuilder` as follows:

```react
import React, { Component } from 'react';

import { FormBuilder } from 'react-json-schema-form-builder';

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: '',
      uischema: ''
    };
  }
  render() {
    return (
      <FormBuilder
        schema={this.state.schema}
        uischema={this.state.uischema}
        onChange={(newSchema: string, newUiSchema: string) => {
          this.setState({
            schema: newSchema,
            uischema: newUiSchema
          })
        }}
        mods={
          {
            customFormInputs
          }
        }
      />
    );
  }
}
```

The `customFormInputs` define the logic that translates abstract "Input Types" into raw data schema and UI schema. For more information about these Custon Form Inputs, see the page [here](Mods.md).

The `tooltipDescriptions` allows an implementation of the `FormBuilder` that changes the tooltip descriptions that appear on hover over certain areas of the tool. The `add` popup appears when hovering over the plus buttons, the `cardObjectName` is the name of the back end name that appears in every card object input, the `cardDisplayName` allows rewriting the description of the display name tooltip, the `cardDescription` option allows overwriting the tooltip for the description, and the `cardInputType` allows setting a custom tooltip for the Input Type dropdown.

### Deactivated Form Inputs

It is also possible to deactivate (hide) certain Input Types by setting the `deactivatedFormInputs` property on mods.  For example, to hide the `time` and `checkbox` form inputs that are usually included by default, you may set the mods to:

```react
mods = {
  deactivatedFormInputs: ['time', 'checkbox'],
}
```

This will hide these Input Types on the `FormBuilder` component.

### Default New Form Element (newElementDefaultDataOptions and newElementDefaultUiSchema)

By default, when adding a new form element, the schema for the new form element is set to:

```react
{
  title: `New Input ${i}`,
  type: 'string',
  default: '',
}
```

and the UI schema is not set at all. This means that by default, a new form element has the "Short answer" input type.  If you wish to override this (for example, if the "Short answer" input is deactivated), you can do so by using the `newElementDefaultDataOptions` and `newElementDefaultUiSchema` mods.  For example, setting the mods to the following:

```react
mods = {
  newElementDefaultDataOptions: {
    '$ref': '#/definitions/firstNames',
    title: 'Field',
  },
};
```

will default new form elements to a "Reference" type to some definition "firstNames" defined in the schema. Setting the mods to the following:

```react
mods = {
  newElementDefaultUiSchema: {
    'ui:widget': 'customWidget',
  }
};
```

will set the UI schema for a new element to use the `customWidget` widget.

### Styling

To avoid collisions with existing CSS styles, this app uses [react-jss](https://cssinjs.org/react-jss/?v=v10.5.0) in order to generate class names avoiding overlap with others in the global scope. Using CSS to style FormBuilder and PredefinedGallery components will not work and is not supported. The ability to "skin" the FormBuilder and PredefinedGallery components may be a feature in the future.
