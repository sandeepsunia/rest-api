/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'AllowedPolicies',
        'upn',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'DeniedPolicies',
        'upn',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'InlinePolicies',
        'upn',
        Sequelize.STRING
      ),
    ]
  },

  down: function (queryInterface) {
    return [
      queryInterface.removeColumn(
        'AllowedPolicies',
        'upn'
      ),
      queryInterface.removeColumn(
        'DeniedPolicies',
        'upn'
      ),
      queryInterface.removeColumn(
        'InlinePolicies',
        'upn'
      )
    ]
  }
}
