// config-overrides.js
const { aliasWebpack, aliasJest } = require('react-app-alias')

const options = {
    configure: {
        experiments: {
            topLevelAwait: true,
        }
    }
} // default is empty for most cases

module.exports = aliasWebpack(options)
module.exports.jest = aliasJest(options)
