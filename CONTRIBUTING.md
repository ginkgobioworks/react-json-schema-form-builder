# Contributing

Anyone should feel free to make a pull request and contribute to the Form Builder codebase. This document gives an overview of the repository structure, how the test harness works, rules for contributing, and information about the CI/CD pipeline in place to publish changes to NPM.

## Opening Issues and Pull Requests

To open an issue, go to the [Github repo](https://github.com/ginkgobioworks/react-json-schema-form-builder) and go to the *Issues* tab. There, click the **New Issue** button and post the feature or bug to be worked on. We ask that, for bug fixes, you enter in the title "[Bug] <Brief description goes here...>", and for features, you title the issues "[Title] <Brief description goes here...>". If an issue falls under neither category, do not add the "[bracket]" tag, and they'll be handled as miscellaneous issues.

For pull requests, go the the *Pull Request* tab on the same repo.

## Repository Structure

In this repository, the source code for the component library is in the `src` directory. Building the repository creates a new folder `dist`, hidden through `.gitignore`, that compiles out the [Flow type annotations](https://flow.org/en/docs/types/) and [JSX](https://reactjs.org/docs/introducing-jsx.html). This is necessary to publish the code onto NPM so that other developers can use the code in their own apps, agnostic to their developer environments.

The example app being run on the [github pages site](https://ginkgobioworks.github.io/react-json-schema-form-builder/), meanwhile, has its code stored in the `example` directory. It relies on an additional set of dependencies, which are stored in the `devDependencies` within the `package.json` file.

## Testing

The `src` directory also contains testing files written for the [jest](https://ginkgobioworks.github.io/react-json-schema-form-builder/) test harness. The tests use [Enzyme](https://github.com/enzymejs/enzyme) for component and DOM manipulation and traversal. These tests are run in the CI/CD pipeline, and must pass before a branch can be merged into the 'main' branch. Changes may be needed to the test harness to accommodate new features or fixes.

Test coverage is [tracked in coverals.io](https://coveralls.io/github/ginkgobioworks/react-json-schema-form-builder) to make sure that test coverage is maintained or increased as time goes on.