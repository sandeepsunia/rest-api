'use strict'

export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    paranoid: false,
    classMethods: {
      associate(models) {
        /**
         * Role --> belongsToMany --> User
         */
        Role.belongsToMany(models.User, {
          foreignKey: 'roleId',
          through: models.UserRole,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          constraints: false,
        })

        /**
         * Role --> HasMany --> AllowedPolicy
         */
        Role.belongsToMany(models.AllowedPolicy, {
          foreignKey: 'roleId',
          through: 'RoleAllowedPolicies',
          as: 'allowedPolicies',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })

        /**
         * Role --> HasMany --> DeniedPolicy
         */
        Role.belongsToMany(models.DeniedPolicy, {
          foreignKey: 'roleId',
          through: 'RoleDeniedPolicies',
          as: 'deniedPolicies',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })

        /**
         * Role --> HasMany --> InlinePolicy
         */
        Role.belongsToMany(models.InlinePolicy, {
          foreignKey: 'roleId',
          through: 'RoleInlinePolicies',
          as: 'inlinePolicies',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })
      }
    }
  })

  return Role
}
