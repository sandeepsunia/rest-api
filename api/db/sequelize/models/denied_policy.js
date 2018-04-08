'use strict'

import { buildPolicyUPN } from './utils'

export default (sequelize, DataTypes) => {
  var DeniedPolicy = sequelize.define('DeniedPolicy', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    upn: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        /**
         * DeniedPolicy --> BelongsToMany --> Role
         */
        DeniedPolicy.belongsToMany(models.Role, {
          foreignKey: 'deniedPolicyId',
          through: 'RoleDeniedPolicies',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })
      }
    }
  })

  DeniedPolicy.beforeCreate(buildPolicyUPN)
  
  return DeniedPolicy
}