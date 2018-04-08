/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('Conferences', 'abbreviation', Sequelize.STRING),
      queryInterface.addColumn('Conferences', 'description', Sequelize.TEXT),
      queryInterface.addColumn('Conferences', 'url', Sequelize.STRING)
    ]
  },

  down: function (queryInterface) {
    return [
      queryInterface.removeColumn('Conferences','description'),
      queryInterface.removeColumn('Conferences','description'),
      queryInterface.removeColumn('Conferences','url')
    ]
  }
}
