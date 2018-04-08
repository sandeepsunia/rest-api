/*eslint-env node*/
var path = require('path')

module.exports = {
  'config': path.resolve('api/db/sequelize', 'sequelize_config.js'),
  'migrations-path':  path.resolve('api/db/sequelize', 'migrations'),
  'models-path':  path.resolve('api/db/sequelize', 'models'),
  'seeders-path': path.resolve('api/db/sequelize', 'seeders')
}
