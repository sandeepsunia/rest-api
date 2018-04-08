/*eslint-env node*/
const PATHS = require('../paths')

module.exports = ({ production = false } = {}) => {
  // const createPresets = enableHotModuleReplacement => {
  //   return ['es2015', 'stage-0']
  // }

  return {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: PATHS.modules
  }
}

