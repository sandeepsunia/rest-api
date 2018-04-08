'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('Users', 'abstract', {
        type: Sequelize.TEXT,
        after: "bio"
      });
    },

    down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('Users', 'abstract');
    }
};

