# React JSON Schema Form Editor

[![npm](https://img.shields.io/npm/v/@ginkgo-bioworks/react-json-schema-form-builder)](https://www.npmjs.com/package/@ginkgo-bioworks/react-json-schema-form-builder)
[![CI](https://github.com/ginkgobioworks/react-json-schema-form-builder/workflows/CI/badge.svg?branch=main)](https://github.com/ginkgobioworks/react-json-schema-form-builder/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub issues](https://img.shields.io/github/issues-raw/ginkgobioworks/react-json-schema-form-builder)](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues)


![demo](https://react-json-schema-form-builder.readthedocs.io/en/latest/img/visualDemo.gif)

This repository contains code for a React JS Component called the `FormBuilder` that allows the user to visually configure a [JSON Schema encoded form](https://json-schema.org/) by dragging, dropping, and editing card elements. An example use case for this tool could be for building an app that allows users to create and distribute their own surveys. The React JSON Schema Form Builder provides components to allow users to dynamically build such survey forms. The Form Builder is also customizable, and can incorporate novel form elements (like a special email address or file upload input), specified by the developer building the survey creation app.

This component is wrapped around a demo app that demonstrates how the tool can be used in conjunction with a code editor and [Mozilla's React JSON schema form viewer](https://github.com/rjsf-team/react-jsonschema-form) to build a form and maintain a live, code representation of it in real time.

The Form Builder is available as an NPM package [here](https://www.npmjs.com/package/@ginkgo-bioworks/react-json-schema-form-builder).

View the Form Builder in action [here](https://ginkgobioworks.github.io/react-json-schema-form-builder/)

More extensive documentation is available [here](https://react-json-schema-form-builder.readthedocs.io/en/main/)

## Quickstart

```bash
npm i --save @ginkgo-bioworks/react-json-schema-form-builder
```

Import the tool as a react component in your Node project:

## Usage

```javascript
import React, { Component } from 'react';
 
import {FormBuilder} from '@ginkgo-bioworks/react-json-schema-form-builder';
 
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

For more usage examples, see the [Usage documentation page](https://react-json-schema-form-builder.readthedocs.io/en/latest/Usage/)

## Contributing

See the [Contributing page](https://github.com/ginkgobioworks/react-json-schema-form-builder/blob/main/CONTRIBUTING.md) for information about improving the Form Builder.

## License

Copyright 2020 [Ginkgo Bioworks](https://www.ginkgobioworks.com/), Inc. Licensed Apache 2.0.

