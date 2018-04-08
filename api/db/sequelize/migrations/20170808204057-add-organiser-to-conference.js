/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Conferences',
      'organiser',
      Sequelize.JSONB
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Conferences',
      'organiser'
    )
  }
}
