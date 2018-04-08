'use strict'

export default (sequelize, DataTypes) => {
  const Conference = sequelize.define('Conference', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      references: 'Schedules',
      referencesKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    abbreviation: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.STRING
    },
    metadata: {
      type: DataTypes.JSONB
    },
    venue: {
      type: DataTypes.JSONB
    },
    organiser: {
      type: DataTypes.JSONB
    },
    active: {
      type: DataTypes.BOOLEAN
    }
  }, {
    classMethods: {
      associate: function(models) {
        /**
         * Conference --> hasOne --> Schedule
         */
        Conference.belongsTo(models.Schedule, {
          as: 'schedule'
        })

        /**
         * Conference --> hasMany --> Track
         */
        Conference.hasMany(models.Track, {
          as: 'tracks',
          foreignKey: 'conferenceId',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        })
      }
    }
  })
  return Conference
}
