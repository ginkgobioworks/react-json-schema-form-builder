# React JSON Schema Form Editor

This repository contains code for a React JS Component called the `FormBuilder` that allows a user to visually drag, drop, and edit card elements corresponding to a JSON schema encoded form. This component is wrapped around a demo app that demonstrates how the tool can be used in conjunction with a code editor and [Mozilla's React JSON schema form viewer](https://github.com/rjsf-team/react-jsonschema-form) to build a form and maintain a live, code representation of it in real time.

The form builder is available as an NPM package [here](https://www.npmjs.com/package/react-jsonschema-form-editor).

## Quickstart

```bash
npm i react-jsonschema-form-editor
```

Import the tool as a react component in your Node project:

## Usage

```javascript
import React, { Component } from 'react';
 
import {FormBuilder} from 'react-jsonschema-form-editor';
 
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

For more usage examples, see the [Usage documentation page](https://github.com/ginkgobioworks/react-jsonschema-form-editor/blob/main/docs/Usage.md)

## Documentation

See the [documentation directory](https://github.com/ginkgobioworks/react-jsonschema-form-editor/blob/main/docs/) for more details.

## Contributing

See the [developer page](https://github.com/ginkgobioworks/react-jsonschema-form-editor/blob/main/docs/Developers.md) for information about improving the form builder.

## Credits

The form builder was built and is maintained by [Ginkgo Bioworks](https://www.ginkgobioworks.com/), and is open sourced through the Apache 2.0 license.

