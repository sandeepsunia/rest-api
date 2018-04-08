'use strict'

import { buildPolicyUPN } from './utils'

export default (sequelize, DataTypes) => {
  var InlinePolicy = sequelize.define('InlinePolicy', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: false
    },
    attribute: {
      type: DataTypes.STRING
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
         * InlinePolicy --> BelongsToMany --> Role
         */
        InlinePolicy.belongsToMany(models.Role, {
          foreignKey: 'inlinePolicyId',
          through: 'RoleInlinePolicies',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })
      }
    }
  })

  InlinePolicy.beforeCreate(buildPolicyUPN)

  return InlinePolicy
}