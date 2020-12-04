# Developers

Under the current license, anyone should feel free to make a pull request and contribute to the form builder code base. This document gives an overview of the code base structure, how the test harness works, rules for contributing, and information about the CI/CD pipeline in place to publish changes to NPM.

**TODO: Code Review, CI/CD, jest integration**

## File structure

In this repository, the source code is in the `src` directory. The Form Builder code itself, however, is only present within the `formBuilder` directory, with the rest of the code in the main `src` directory being code for the wrapper that runs the [demo app](https://ginkgobioworks.github.io/react-jsonschema-form-editor/). 

## Testing

The `src` directory also contains testing files written with [jest](https://ginkgobioworks.github.io/react-jsonschema-form-editor/) which use [enzyme](https://github.com/enzymejs/enzyme). These tests are run in the CI/CD pipeline, and must pass for publishing. Changes may be needed to the test harness to accommodate new features or fixes.

Jest test coverage is also monitored to make sure that test coverage is maintained or increased as time goes on.

TODO: Jest and coveralls

## Contributing and Governance

TODO: determine developer governance

## CI/CD

TODO: Figure out CI/CD