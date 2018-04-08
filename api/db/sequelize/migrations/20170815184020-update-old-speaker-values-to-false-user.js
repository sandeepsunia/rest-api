/*eslint-env node*/
'use strict'

module.exports = {
  up: function (migration) {
    return migration.sequelize.query('UPDATE "Users" set speaker=false')
  },

  down: function (migration) {
    return migration.sequelize.query('UPDATE "Users" set speaker=null')
  }
}
