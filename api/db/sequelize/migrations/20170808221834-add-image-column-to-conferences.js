/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Conferences',
      'image',
      Sequelize.TEXT
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Conferences',
      'image'
    )
  }
}
