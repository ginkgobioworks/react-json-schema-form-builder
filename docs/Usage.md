# Usage

Various code snippets and explanations of how they work with the form builder

## FormBuilder Component

The following example is a React component that simply maintains a form builder and stores the corresponding JSON schema as state variables, instead of rendering them in any way.

```react
import React, { Component } from 'react';
 
import {FormBuilder} from 'react-json-schema-form-builder';
 
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
      />
    );
  }
}
```

### With React JSON Schema Form

Most likely, you will want to visually build the form with some preview of the rendered form available.

This will require you to use some implementation of the `Form` component from [RJSF](https://react-jsonschema-form.readthedocs.io/en/latest/).  React component to render the JSON schema as a form. This example uses [@rjsf/core](https://www.npmjs.com/package/@rjsf/core):

``` bash
npm i @rjsf/core
```

The following example uses this form preview adjacent to the form builder:

``` react
import React, { Component } from 'react';
 
import {FormBuilder} from 'react-json-schema-form-builder';
import Form from '@rjsf/core';
 
class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: '',
      uischema: '',
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
 
import {FormBuilder, PredefinedGallery} from "@ginkgobioworks/react-json-schema-form-builder";
 
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

## Advanced

### Plugins

In addition to the default types of form inputs (Time, Checkbox, Radio, Dropdown, Short Answer, Long Answer, Password, Integer, Number, Array), custom form inputs can also be specified. These form inputs are defined in a JS object that is passed into the `FormBuilder` component (and the `PredefinedGallery` component if it's being used) as part of a `mods` property, which has a comprehensive type definition in [src/formBuilder/types.js](https://github.com/ginkgobioworks/react-json-schema-form-builder/blob/main/src/formBuilder/types.js) as `Mods`.

#### Example Plugin

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
 
import FormBuilder from 'react-json-schema-form-builder';
 
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
            optionalFormInputs: customFormInputs
          }
        }
      />
    );
  }
}
```

The full type definition of the mods that can be passed into the `FormBuilder` and `PredefinedGallery` (they must be passed into both!) are as follows:

``` react
export type Mods = {
  customFormInputs?: {
    [string]: FormInput
  },
  tooltipDescriptions?: {
    add?: string,
    cardObjectName?: string,
    cardDisplayName?: string,
    cardDescription?: string,
    cardInputType?: string
  }
}
```

The `customFormInputs` define the logic that translates abstract "Input Types" into raw data schema and ui schema. For more information about these "Plugin" input types, see the page [here](Plugins.md).

The `tooltipDescriptions` allows an implementation of the `FormBuilder` that changes the tooltip descriptions that appear on hover over certain areas of the tool. The `add` popup appears when hovering over the plus buttons, the `cardObjectName` is the name of the back end name that appears in every card object input, the `cardDisplayName` allows rewriting the description of the display name tooltip, the `cardDescription` option allows overwriting the tooltip for the description, and the `cardInputType` allows setting a custom tooltip for the Input Type dropdown.

### Styling

To avoid collisions with existing CSS styles, this app uses [react-jss](https://cssinjs.org/react-jss/?v=v10.5.0) in order to generate class names avoiding overlap with others in the global scope. Using CSS to style FormBuilder and PredefinedGallery components will not work and is not supported. The ability to "skin" the FormBuilder and PreDefinedGallery components may be a feature in the future.

**TODO: JS Stylesheet**