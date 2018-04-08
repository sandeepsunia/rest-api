/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Events',
      'metadata',
      Sequelize.JSONB
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Events',
      'metadata'
    )
  }
}
