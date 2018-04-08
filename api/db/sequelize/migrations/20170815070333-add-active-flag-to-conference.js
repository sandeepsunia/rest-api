/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Conferences',
      'active',
      Sequelize.BOOLEAN
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Conferences',
      'active'
    )
  }
}
