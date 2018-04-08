'use strict'

export default (sequelize, DataTypes) => {
  var Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        /**
         * Schedule --> belongsTo --> Conference
         */
        Schedule.hasOne(models.Conference, {
          foreignKey: 'scheduleId'
        })
        /**
         * Schedule --> belongsTo --> Track
         */
        Schedule.hasOne(models.Track, {
          foreignKey: 'scheduleId'
        })
        /**
         * Schedule --> belongsTo --> Event
         */
        Schedule.hasOne(models.Event, {
          foreignKey: 'scheduleId'
        })
      }
    }
  })
  return Schedule
}