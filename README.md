# React JSON Schema Form Editor

This repository contains code for a React JS Component called the `FormBuilder` that allows a user to visually drag, drop, and edit card elements corresponding to a JSON schema encoded form. This component is wrapped around a demo app that demonstrates how the tool can be used in conjunction with a code editor and [Mozilla's React JSON schema form viewer](https://github.com/rjsf-team/react-jsonschema-form) to build a form and maintain a live, code representation of it in real time.

## Installation

To run the *demo app*, first open up a fresh directory and type the following to clone the repository:
```
git clone https://github.com/ginkgobioworks/react-jsonschema-form-editor.git
cd react-jsonschema-form-editor
```

Then, run the following command to install the appropriate dependencies:
```
npm install
```

Finally, to deploy the app, enter the following command to locally run a server and operate the app using your default browser:
```
npm start
```

## Usage

```javascript
import React, { Component } from 'react';
 
import FormBuilder from 'react-jsonschema-form-editor';
 
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
        lang={'json'}
      />
    );
  }
}
```

## Plugins
In addition to the default types of form inputs (Time, Checkbox, Radio, Dropdown, Short Answer, Long Answer, Password, Integer, Number, Array), custom form inputs can also be specified. These form inputs are defined in a JS object that is passed into the `FormBuilder` component as part of a `mods` property, which has a comprehensive type definition in src/formBuilder/types.js.

#### Example Plugin
```javascript
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
```javascript
import React, { Component } from 'react';
 
import FormBuilder from 'react-jsonschema-form-editor';
 
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
        lang={'json'}
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
