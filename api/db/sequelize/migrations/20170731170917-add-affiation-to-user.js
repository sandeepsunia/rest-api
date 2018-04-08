/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Users',
      'affiliation',
      Sequelize.TEXT
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Users',
      'affiliation'
    )
  }
}
