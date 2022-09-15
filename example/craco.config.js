const {CracoAliasPlugin} = require('react-app-alias');

const options = {};

module.exports = {
  eslint: null,
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {},
    },
  ]
};
