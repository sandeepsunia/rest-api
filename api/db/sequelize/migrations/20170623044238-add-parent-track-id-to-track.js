/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Tracks',
      'parentTrackId',
      Sequelize.INTEGER
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Tracks',
      'parentTrackId'
    )
  }
}
