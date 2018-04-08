/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Events',
      'image',
      Sequelize.TEXT
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Events',
      'image'
    )
  }
}
