/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('RoleAllowedPolicies', {
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
      allowedPolicyId: {
        references: {
          model: 'AllowedPolicies',
          key: 'id'
        },
        type: Sequelize.INTEGER,
        allowNull: false
      }
    })
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('RoleAllowedPolicies')
  }
}
