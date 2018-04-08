/*eslint-env node*/

const webpack = require('webpack')

module.exports = ({ production = false } = {}) => {

  if (!production) {
    return [
      new webpack.EnvironmentPlugin(['NODE_ENV'])
    ]
  }
  return [
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ]
}
