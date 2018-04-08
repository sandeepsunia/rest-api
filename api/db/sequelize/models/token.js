export default (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    kind: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    instanceMethods: {
      toJSON() {
        return {
          kind: this.kind,
          token: this.accessToken
        }
      }
    },
    classMethods: {
      associate(models) {
        Token.belongsTo(models.User, {
          foreignKey: 'userId',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        })
      }
    }
  })

  return Token
}
