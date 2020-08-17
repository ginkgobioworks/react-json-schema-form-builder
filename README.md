# React JSON Schema Form Editor

[![npm](https://img.shields.io/npm/v/@ginkgo-bioworks/react-json-schema-form-builder)](https://www.npmjs.com/package/@ginkgo-bioworks/react-json-schema-form-builder)
[![Build Status](https://travis-ci.com/ginkgobioworks/react-json-schema-form-builder.svg?branch=main)](https://travis-ci.com/ginkgobioworks/react-json-schema-form-builder)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![GitHub issues](https://img.shields.io/github/issues-raw/ginkgobioworks/react-json-schema-form-builder)


![demo](https://react-json-schema-form-builder.readthedocs.io/en/latest/img/visualDemo.gif)

This repository contains code for a React JS Component called the `FormBuilder` that allows a user to visually drag, drop, and edit card elements corresponding to a [JSON schema](https://json-schema.org/) encoded form. This component is wrapped around a demo app that demonstrates how the tool can be used in conjunction with a code editor and [Mozilla's React JSON schema form viewer](https://github.com/rjsf-team/react-jsonschema-form) to build a form and maintain a live, code representation of it in real time.

The Form Builder is available as an NPM package [here](https://www.npmjs.com/package/@ginkgo-bioworks/react-json-schema-form-builder).

View the Form Builder in action [here](https://ginkgobioworks.github.io/react-json-schema-form-builder/)

More extensive documentation is available [here](https://react-json-schema-form-builder.readthedocs.io/en/main/Home/)

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

See the [Contributing page](https://react-json-schema-form-builder.readthedocs.io/en/latest/CONTRIBUTING/) for information about improving the Form Builder.

## License

Copyright 2020 [Ginkgo Bioworks](https://www.ginkgobioworks.com/), Inc. Licensed Apache 2.0.

