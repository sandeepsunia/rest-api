/*eslint-env node*/
'use strict'

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('UserRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        references: {
          model: 'Users',
          key: 'id'
        },
        type: Sequelize.INTEGER,
        allowNull: false
      },
      roleId: {
        references: {
          model: 'Roles',
          key: 'id'
        },
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('UserRoles')
  }
}