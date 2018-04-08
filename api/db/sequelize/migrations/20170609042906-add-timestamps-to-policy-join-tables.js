/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'RoleAllowedPolicies',
        'createdAt',
        Sequelize.DATE
      ),
      queryInterface.addColumn(
        'RoleAllowedPolicies',
        'updatedAt',
        Sequelize.DATE
      ),
      queryInterface.addColumn(
        'RoleDeniedPolicies',
        'createdAt',
        Sequelize.DATE
      ),
      queryInterface.addColumn(
        'RoleDeniedPolicies',
        'updatedAt',
        Sequelize.DATE
      ),
      queryInterface.addColumn(
        'RoleInlinePolicies',
        'createdAt',
        Sequelize.DATE
      ),
      queryInterface.addColumn(
        'RoleInlinePolicies',
        'updatedAt',
        Sequelize.DATE
      )
    ]
  },

  down: function (queryInterface) {
    return [
      queryInterface.removeColumn(
        'RoleAllowedPolicies',
        'createdAt'
      ),
      queryInterface.removeColumn(
        'RoleAllowedPolicies',
        'updatedAt'
      ),
      queryInterface.removeColumn(
        'RoleDeniedPolicies',
        'createdAt'
      ),
      queryInterface.removeColumn(
        'RoleDeniedPolicies',
        'updatedAt'
      ),
      queryInterface.removeColumn(
        'RoleInlinePolicies',
        'createdAt'
      ),
      queryInterface.removeColumn(
        'RoleInlinePolicies',
        'updatedAt'
      )
    ]
  }
}
