'use strict'

export default (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
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
    roleId: {
      type: DataTypes.INTEGER,
      references: 'Roles',
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

  return UserRole
}
