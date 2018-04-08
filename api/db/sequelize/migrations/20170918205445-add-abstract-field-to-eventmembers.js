'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('EventMembers', 'abstract', {
      type: Sequelize.TEXT,
      after: "eventId"
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('EventMembers', 'abstract');
  }
};
