/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Tracks',
      'metadata',
      Sequelize.JSONB
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Tracks',
      'metadata'
    )
  }
}
