/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
			'Tokens',
			'accessToken',
			{ type: Sequelize.TEXT }
		)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
			'Tokens',
			'accessToken',
			{ type: Sequelize.STRING }
		)
  }
}
