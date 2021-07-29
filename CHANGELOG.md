# Changelog

## [2.6.0] - 2021-07-29

### Fixed

- Configuring a dependency overrides the element's title, used for the label, to the definition's title. (See [issue #162](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/162).)

### Added

- Added ability to change `ui:column`.
- Added ability to change input's placeholder.

## [2.5.1] - 2021-07-19

### Fixed

- Deactivate form inputs in arrays when specified in `deactivatedFormInputs`.

### Changed

- Updated dependencies in package-lock.json
- Updated dependencies in example/package.json and example/package-lock.json

## [2.5.0] - 2021-06-20

### Added

- Object and Section Name are no longer restricted.

### Fixed

- Support ui:options in UI Schema. (See [pr #107](https://github.com/ginkgobioworks/react-json-schema-form-builder/pull/107).)
- Support adding more than 10 elements using default naming. (See [issue #115](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/115).)
- A number of issues in Flow that manifested with flow-bin upgrade. 
- Fixed missing matchIf entries for the various format options in Short Answer. (See [issue #119](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/119).)
- Removed broken format dropdown from Long Answer input type.
- Prevent duplicate object names. (See [issue #113](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/113).)


### Changed

- Updated dependencies in package-lock.json
- Input type dropdown is sorted
- Time, Date, and Date-Time are now input types included by default. Time and Date-time are no longer format options for Short Answer.

## [2.4.2] - 2021-05-09

### Fixed

- CardModal state was not being reverted when the cancel button was pressed. (See [issue #98](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/98).)
- Object name of array item was editable when it should not have been. (See [issue #31](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/31).)
- Could not select Reference as input type for array item. (See [pr #97](https://github.com/ginkgobioworks/react-json-schema-form-builder/pull/97).)

### Changed

- Updated dependencies

## [2.4.1] - 2021-05-06

### Fixed

- Ablity to deactivate shortAnswer form input type without the form builder crashing when it cannot recognize a form input type in a schema.

## [2.4.0] - 2021-05-05

### Added

- Added the ability to set a default UI schema for new elements (`newElementDefaultUiSchema` mod).

## [2.3.1] - 2021-05-05

### Fixed

- Ability to deactivate form inputs while still being able to set a "string" type custom form input as default.

### Changed

- Updated package-lock.json dependencies.

## [2.3.0] - 2021-05-03

### Added

- Added recognition of "schema" and "meta" keywords in the JSON schema.
- Added ability to deactivate form inputs.
- Added ability to specify different default form input options.

### Changed

- Updated dependencies

### Fixed

- In certain instances, definitions of type "object" would cause an error. (See [pr #78](https://github.com/ginkgobioworks/react-json-schema-form-builder/pull/78).)

## [2.2.0] - 2021-04-12

### Added

- Allow users to add titles and descriptions for references

### Changed

- Removed test matrix from CI

## [2.1.1] - 2021-04-09

### Changed

- Updated dependencies

### Fixed

- Fixed publication of empty package

## [2.1.0] - 2021-04-08

### Added

- Allow users to override default labels using mods (See [issue #62](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/62).)
- Added Dependabot integration.

### Changed

- Migrated from Travis-CI to GitHub Actions for CI.
- Updated dependencies

## [2.0.0] - 2021-03-22

### Changed

- Made `bootstrap` an explicit peer dependency. Used React Font Awesome components to make Font Awesome dependency explicit. (See [issue #30](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/30).)
- Minor changes to Backgrond section of documentation.

### Fixed

- Fixed defective '+' button in Dependencies for Sections.

## [1.2.0] - 2021-03-03

### Added

- Added ability to modify label for Form Title and Form Description inputs as well as tooltips for Section Object Name, Section Display Name, and Section Description. Added ability to hide Form Builder head (Form Title and Form Description inputs). ([issue #22](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/22))

### Changed

- Updated `react-scripts` and other devDependencies.

## [1.1.2] - 2021-02-15

### Fixed

- Fixed [issue #23](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/23).
- Fixed [issue #19](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/19).
- Fixed incorrect serialization of data in usage of `react-json-editor-ajrm` component in example app.

## [1.1.1] - 2021-01-12

### Fixed

- Fixed [issue #9](https://github.com/ginkgobioworks/react-json-schema-form-builder/issues/9); `mods` now propagated to Section components, so Array types can use Custom Form Inputs.
- Fixed missing Bootstrap 4 theme in example app.

### Changed

- `prettier` check is now part of the CI pipeline.
- Minor updates to documentation.

## [1.1.0] - 2020-12-29

### Added

- Added Flow type definitions to repository.

### Changed

- Minor updates to documentation
- Parallelized test jobs covering multiple Node versions in Travis-CI pipeline.

## [1.0.6] - 2020-12-11

### Fixed

- fix travis.yml to skip cleanup

## [1.0.5] - 2020-12-11

### Fixed

- remove npmignore

## [1.0.4] - 2020-12-11

### Fixed

- revert to `package.json` files

## [1.0.3] - 2020-12-11

### Fixed

- fix `after_script` in `.travis-yml` to build before publish

## [1.0.2] - 2020-12-11

### Fixed

- switch to `.npmignore`

## [1.0.1] - 2020-12-11

### Fixed

- changed package 'files' field

## [1.0.0] - 2020-12-11

### Added

- form builder source code
- form builder example app
- tests
- travis-ci integration
- documentation
