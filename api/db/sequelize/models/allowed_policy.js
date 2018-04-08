'use strict'

import { buildPolicyUPN } from './utils'

export default (sequelize, DataTypes) => {
  var AllowedPolicy = sequelize.define('AllowedPolicy', {
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
         * AllowedPolicy --> BelongsToMany --> Role
         */
        AllowedPolicy.belongsToMany(models.Role, {
          foreignKey: 'allowedPolicyId',
          through: 'RoleAllowedPolicies',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })
      }
    }
  })

  AllowedPolicy.beforeCreate(buildPolicyUPN)

  return AllowedPolicy
}