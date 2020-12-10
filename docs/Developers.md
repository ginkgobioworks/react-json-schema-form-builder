# Contributing

Anyone should feel free to make a pull request and contribute to the Form Builder codebase. This document gives an overview of the repository structure, how the test harness works, rules for contributing, and information about the CI/CD pipeline in place to publish changes to NPM.

## Opening Issues and Pull Requests

Refer to the [Contributing page](https://react-json-schema-form-builder.readthedocs.io/en/latest/Contributing) for details about opening issues and pull requests. There, you can find templates for issues and pull requests, and best practices for contributing.

## Repository Structure

In this repository, the source code for the component library is in the `src` directory. Building the repository creates a new folder `dist`, hidden through `.gitignore`, that compiles out the [Flow type annotations](https://flow.org/en/docs/types/) and [JSX](https://reactjs.org/docs/introducing-jsx.html). This is necessary to publish the code onto NPM so that other developers can use the code in their own apps, agnostic to their developer environments.

The example app being run on the [github pages site](https://ginkgobioworks.github.io/react-json-schema-form-builder/), meanwhile, has its code stored in the `example` directory. It relies on an additional set of dependencies, which are stored in the `devDependencies` within the `package.json` file.

## Testing

The `src` directory also contains testing files written for the [jest](https://ginkgobioworks.github.io/react-json-schema-form-builder/) test harness. The tests use [Enzyme](https://github.com/enzymejs/enzyme) for component and DOM manipulation and traversal. These tests are run in the CI/CD pipeline, and must pass before a branch can be merged into the 'main' branch. Changes may be needed to the test harness to accommodate new features or fixes.

Test coverage is [tracked in coverals.io](https://coveralls.io/github/ginkgobioworks/react-json-schema-form-builder) to make sure that test coverage is maintained or increased as time goes on.
