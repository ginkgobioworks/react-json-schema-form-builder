// config-overrides.js
import { aliasWebpack, aliasJest } from 'react-app-alias'

const options = {} // default is empty for most cases

module.exports = aliasWebpack(options)
module.exports.jest = aliasJest(options)
