# Installation

## Library

The Form Builder is available as an NPM package [here](https://www.npmjs.com/package/@ginkgo-bioworks/react-json-schema-form-builder).

To install the Form Builder into your NodeJS project, open a terminal and type the following:

```bash
npm i --save @ginkgo-bioworks/react-json-schema-form-builder
```

### Peer Dependencies

The Form Builder requires the following peer dependencies:

- `react` (^19.0.0)
- `@mui/material` (^7.0.0)
- `@emotion/react` (^11.14.0)
- `@emotion/styled` (^11.14.0)

Install these if they're not already in your project:

```bash
npm i --save @mui/material @emotion/react @emotion/styled
```

The Form Builder can then be imported as a React component in any ReactJS file as follows:

```javascript
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';
```

## Demo App

To run the *demo app*, first clone the repository:

```bash
git clone https://github.com/ginkgobioworks/react-json-schema-form-builder.git
cd react-json-schema-form-builder
```

Install dependencies and build the library:

```bash
npm install
npm run build
```

Then navigate to the example directory and start the app:

```bash
cd example
npm install
npm run dev
```

Then open the following URL in your browser: http://localhost:3000/react-json-schema-form-builder
