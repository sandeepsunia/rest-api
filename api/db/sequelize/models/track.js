'use strict'
export default (sequelize, DataTypes) => {
  var Track = sequelize.define('Track', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parentTrackId: {
      type: DataTypes.INTEGER,
      references: 'Tracks',
      referencesKey: 'id'
    },
    conferenceId: {
      type: DataTypes.INTEGER,
      references: 'Conferences',
      referencesKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      references: 'Schedules',
      referencesKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    metadata: {
      type: DataTypes.JSONB
    }
  }, {
    classMethods: {
      associate: function(models) {
        /**
         * Track --> hasOne --> Schedule
         */
        Track.belongsTo(models.Schedule, {
          foreignKey: 'scheduleId',
          as: 'schedule'
        })

        /**
         * ParentTrack --> hasMany --> ChildTrack
         */
        Track.hasMany(Track, {
          as: 'childTracks',
          through: null,
          foreignKey: 'parentTrackId'
        })

        /**
         * Track --> belongsTo --> Conference
         */
        Track.belongsTo(models.Conference, {
          foreignKey: 'conferenceId'
        })
        
        /**
         * Track --> hasMany --> Events
         */
        Track.hasMany(models.Event, {
          as: 'events',
          foreignKey: 'trackId',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        })
      }
    }
  })
  return Track
}