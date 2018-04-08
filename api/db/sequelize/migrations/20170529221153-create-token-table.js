/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Tokens', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        kind: {
          type: Sequelize.STRING,
          allowNull: false
        },
        accessToken: {
          type: Sequelize.STRING,
          allowNull: false
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          }
        }
      }
    )
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('Tokens')
  }
}
