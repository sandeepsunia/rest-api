/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Conferences',
      'image',
      {
        type: Sequelize.STRING,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Conferences',
      'image',
      {
        type: Sequelize.TEXT
      }
    )
  }
}
