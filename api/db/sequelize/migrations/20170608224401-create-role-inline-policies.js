/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('RoleInlinePolicies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        references: {
          model: 'Roles',
          key: 'id'
        },
        type: Sequelize.INTEGER,
        allowNull: false
      },
      inlinePolicyId: {
        references: {
          model: 'InlinePolicies',
          key: 'id'
        },
        type: Sequelize.INTEGER,
        allowNull: false
      }
    })
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('RoleInlinePolicies')
  }
}
