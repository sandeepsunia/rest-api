/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Users',
      'google',
      Sequelize.STRING
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Users',
      'google'
    )
  }
}
