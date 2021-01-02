# Contributing

Anyone should feel free to make a pull request and contribute to the Form Builder codebase. This document gives an overview of the repository structure, how the test harness works, rules for contributing, and information about the CI/CD pipeline in place to publish changes to NPM.

## Opening Issues and Pull Requests

To open an issue, go to the [GitHub repo](https://github.com/ginkgobioworks/react-json-schema-form-builder) and go to the *Issues* tab. There, click the **New Issue** button and post the feature or bug to be worked on. We ask that, for bug fixes, you enter in the title "[Bug] <Brief description goes here...>", and for features, you title the issues "[Title] <Brief description goes here...>". If an issue falls under neither category, do not add the "[bracket]" tag, and they'll be handled as miscellaneous issues.

For pull requests, go the the *Pull Request* tab on the same repo. Select the branch that you created after clicking *New Pull Request* and provide a title and description for the request. You will want to merge to the main branch, as once a merge is successful, a pipeline will be kicked off the update the documentation, demo app, and publish to npm if all of the tests pass. The status of your PR in tests will also be available when you go through this process. Approval must be given from one of the administrators for a PR to be accepted.

## Repository Structure

In this repository, the source code for the component library is in the `src` directory. Building the repository creates a new folder `dist`, hidden through `.gitignore`, that compiles out the [Flow type annotations](https://flow.org/en/docs/types/) and [JSX](https://reactjs.org/docs/introducing-jsx.html). This is necessary to publish the code onto NPM so that other developers can use the code in their own apps, agnostic to their developer environments.

The example app being run on the [GitHub Pages site](https://ginkgobioworks.github.io/react-json-schema-form-builder/), meanwhile, has its code stored in the `example` directory. It relies on an additional set of dependencies, which are stored in the `devDependencies` within the `package.json` file.

Library definitions for [Flow type annotations](https://flow.org/en/docs/types/) are stored in `flow-libdef`, where the file structure under the `flow-typed` [best practices](https://github.com/flow-typed/flow-typed/blob/master/CONTRIBUTING.md) are followed. If any of the types in `src/formBuilder/types.js` are changed, or if the properties of the `FormBuilder` or `PredefinedGallery` are altered, then these `flow-typed` library definitions as well as the definitions in the actual `flow-typed` [repository](https://github.com/flow-typed/flow-typed) should also be changed. These library definitions are updated manually, and are currently set for major version 1 of the Form Builder. To update to library definition in the `flow-typed` repository a PR must be made on the [flow-typed repository](https://github.com/flow-typed/flow-typed).

## Testing

The `src` directory also contains testing files written for the [jest](https://jestjs.io/en/) test harness. The tests use [Enzyme](https://github.com/enzymejs/enzyme) for component and DOM manipulation and traversal. These tests are run in the CI/CD pipeline, and must pass before a branch can be merged into the 'main' branch. Changes may be needed to the test harness to accommodate new features or fixes.

The CI/CD pipeline also runs `prettier`, `eslint`, and `flow` checks which must pass before a branch can be merged into 'main'. You can run `npm run prettier` to auto-format code to pass `prettier` standards, and `npm test` to run all of these tests to ensure that they will pass in the CI/CD pipeline.

Test coverage is [tracked in coveralls.io](https://coveralls.io/github/ginkgobioworks/react-json-schema-form-builder) to make sure that test coverage is maintained or increased as time goes on.

## Documentation

Documentation is stored in the `docs` directory, and it is used to generate documentation on https://react-json-schema-form-builder.readthedocs.io/. Builds for the [Read the Docs](https://readthedocs.org/) site are triggered with every push to the `main` branch, which submits a job to the Read the Docs server. This job reads the `.readthedocs.yml` file for configuratoin, which points to the `mkdocs.yml` file for more instructions on how to serve the markdown files.

## Demo

GitHub Pages runs off the `gh-pages` branch, which can only be pushed to by the Travis CI bot. After passing all of the tests on `main`, the CI pipeline will automatically push the files in `example/build` onto  the `gh-pages` branch, which will update the demo available on the static GitHub Pages site https://ginkgobioworks.github.io/react-json-schema-form-builder/

## Release

The maintainers will release new versions to NPM as appropriate. The procedure that the maintainers will use to release is to update the changelog with the newest version, update the package.json version, and tag the main branch with the version number, upon which the travis-CI will run tests again before deploying to NPM automatically.
