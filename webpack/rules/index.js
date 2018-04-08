/*eslint-env node*/
const javascript = require('./javascript')

module.exports = ({ production = false } = {}) => (
  [
    javascript({ production })
  ]
)
