# Changelog

## [2.3.0] - 2021-05-03

### Added

- Added recognition of "schema" and "meta" keywords in the JSON schema.
- Added ability to deactivate form inputs.

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
