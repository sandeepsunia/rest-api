/*eslint-env node*/
'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
      .createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING
        },
        name: {
          type: Sequelize.STRING,
          defaultValue: ''
        },
        gender: {
          type: Sequelize.STRING,
          defaultValue: ''
        },
        location: {
          type: Sequelize.STRING,
          defaultValue: ''
        },
        picture: {
          type: Sequelize.STRING,
          defaultValue: ''
        },
        resetPasswordToken: {
          type: Sequelize.STRING
        },
        resetPasswordExpires: {
          type: Sequelize.DATE
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deletedAt: {
          type: Sequelize.DATE
        }
      }, {
        paranoid: true
      })
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('Users')
  }
}
