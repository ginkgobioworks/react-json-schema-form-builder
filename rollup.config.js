import ts from 'rollup-plugin-ts';

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'esm',
      file: 'dist/index.mjs',
    },
    {
      format: 'cjs',
      file: 'dist/index.js',
    },
  ],
  external: [
    'classnames',
    'react',
    'reactstrap',
    'react-jss',
    'react-select',
    '@hello-pangea/dnd',
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/react-fontawesome',
  ],
  plugins: [ts()],
};
