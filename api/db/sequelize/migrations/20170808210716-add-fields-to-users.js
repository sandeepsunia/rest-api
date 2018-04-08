/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'social', Sequelize.JSONB)
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('Users','social')
  }
}
