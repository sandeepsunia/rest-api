/*eslint-env node*/

const PATHS = require('./paths')
const rules = require('./rules')
const plugins = require('./plugins')
const externals = require('./externals')
const resolve = require('./resolve')

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  
  const node = { __dirname: true, __filename: true }

  const prodConfig = {
    devtool: 'source-map',
    context: PATHS.app,
    entry: { server: './api/index' },
    target: 'node',
    node,
    externals,
    output: {
      path: PATHS.compiled,
      filename: '[name].js',
      publicPath: PATHS.public,
      libraryTarget: 'commonjs2'
    },
    module: { rules: rules({ production: true }) },
    resolve,
    plugins: plugins({ production: true })
  }

  const devConfig = {
    devtool: 'source-map',
    context: PATHS.app,
    entry: { server: './api/index' },
    target: 'node',
    node,
    externals,
    output: {
      path: PATHS.compiled,
      filename: '[name].dev.js',
      publicPath: PATHS.public,
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    module: { rules: rules({ production: true }) },
    resolve,
    plugins: plugins({ production: true })
  }

  if (isProduction) {
    return prodConfig
  } else {
    return devConfig
  }
}
