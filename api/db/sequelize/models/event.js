'use strict'

export default (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
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
    trackId: {
      type: DataTypes.INTEGER,
      references: 'Tracks',
      referencesKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.TEXT
    },
    subscribe: {
      type: DataTypes.BOOLEAN,
      default: false
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
    defaultScope: {
      where: {
        status: 'published'
      }
    },
    scopes: {
      deleted: {
        where: {
          status: 'deleted'
        }
      },
      drafts: {
        where: {
          status: 'draft'
        }
      },
      published: {
        where: {
          status: 'published'
        }
      }
    },
    classMethods: {
      associate: function(models) {

        /**
         * Event --> hasOne --> Schedule
         */
        Event.belongsTo(models.Schedule, {
          as: 'schedule'
        })

        /**
         * Event --> belongsTo --> Track
         */
        Event.belongsTo(models.Track, {
          foreignKey: 'trackId'
        })

        /**
         * Event --> belongsToMany --> Members // ideally treated as One to Many
         */
        Event.belongsToMany(models.User, {
          as: 'members',
          foreignKey: 'eventId',
          through: 'EventMembers',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        })

        Event.belongsToMany(models.WorkingGroup, {
          foreignKey: 'eventId',
          through: 'WorkingGroups',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })
      }
    }
  })
  return Event
}
