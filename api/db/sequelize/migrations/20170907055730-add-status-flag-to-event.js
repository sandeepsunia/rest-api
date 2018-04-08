/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Events', 'status', Sequelize.TEXT)
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('Events','status')
  }
}
