/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Conferences',
      'venue',
      Sequelize.JSONB
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Conferences',
      'venue'
    )
  }
}
