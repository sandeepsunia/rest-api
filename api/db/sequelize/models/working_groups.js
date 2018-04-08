'use strict'

export default (sequelize, DataTypes) => {
  const WorkingGroup = sequelize.define('WorkingGroup', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      references: 'Users',
      referencesKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    eventId: {
      type: DataTypes.INTEGER,
      references: 'Events',
      referencesKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    paranoid: false,
    classMethods: {
      // associate: function(models) {
      //   // associations can be defined here
      // }
    }
  })

  return WorkingGroup
}
