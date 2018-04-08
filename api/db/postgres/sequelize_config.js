/*eslint no-undef: "error"*/
/*eslint-env node*/

var sequelizeLogger = require('sequelize-log-syntax-colors')

module.exports = {
  development: {
    username: process.env.PGUSER || 'postgres',
    password: 'postgres',
    database: 'cmts_dev',
    host: process.env.PG_HOST || 'localhost',
    dialect: 'postgres',
    logging: sequelizeLogger
  },
  test: {
    username: process.env.PGUSER || 'postgres',
    password: 'postgres',
    database: 'cmts_test',
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'localhost',
    username: process.env.PGUSER || 'postgres',
    password: 'postgres',
    database: 'cmts_production',
    host: process.env.PG_HOST || 'cmts_db',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
}
