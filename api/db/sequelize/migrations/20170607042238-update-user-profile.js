/*eslint-env node*/

'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'Users',
        'title',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'Users',
        'bio',
        Sequelize.TEXT
      ),
      queryInterface.addColumn(
        'Users',
        'contact',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'Users',
        'address',
        Sequelize.TEXT
      )
    ]
  },

  down: function (queryInterface) {
    return [
      queryInterface.removeColumn(
        'Users',
        'title'
      ),
      queryInterface.removeColumn(
        'Users',
        'bio'
      ),
      queryInterface.removeColumn(
        'Users',
        'contact'
      ),
      queryInterface.removeColumn(
        'Users',
        'address'
      )
    ]
  }
}
