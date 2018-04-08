/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Users',
      'speaker',
      Sequelize.BOOLEAN
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Users',
      'speaker'
    )
  }
}
