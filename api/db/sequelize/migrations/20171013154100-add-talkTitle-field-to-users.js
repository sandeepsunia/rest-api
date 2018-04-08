'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('Users', 'talkTitle', {
        type: Sequelize.TEXT,
        after: "abstract"
      });
    },

    down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('Users', 'talkTitle');
    }
};

