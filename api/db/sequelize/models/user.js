import Promise from 'bluebird'
import bcryptNode from 'bcrypt-nodejs'

const bcrypt = Promise.promisifyAll(bcryptNode)

function hashPassword (user) {
  if (!user.changed('password')) return null
  return bcrypt.genSaltAsync(5).then(salt =>
    bcrypt.hashAsync(user.password, salt, null).then((hash) => {
      user.password = hash
    })
  )
}

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    picture: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    resetPasswordToken: {
      type: DataTypes.STRING
    },
    resetPasswordExpires: {
      type: DataTypes.DATE
    },
    google: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    },
    affiliation: {
      type: DataTypes.TEXT
    },
    abstract: {
      type: DataTypes.TEXT
    },
    talkTitle: {
      type: DataTypes.TEXT
    },
   bio: {
      type: DataTypes.TEXT
    },
    contact: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    speaker: {
      type: DataTypes.BOOLEAN
    }
  }, {
    paranoid: true,
    classMethods: {
      associate(models) {
        /**
         * User --> hasOne --> Token
         */
        
        User.hasOne(models.Token, {
          foreignKey: 'userId',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })
        /**
         * User --> HABTM --> Role
         */
        User.belongsToMany(models.Role, {
          foreignKey: 'userId',
          through: models.UserRole,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })

        /**
         * User --> HABTM --> Events
         */
        User.belongsToMany(models.Event, {
          foreignKey: 'memberId',
          through: 'EventMembers',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })

        User.belongsToMany(models.WorkingGroup, {
          foreignKey: 'userId',
          through: 'WorkingGroups',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          constraints: false
        })
      }
    },
    instanceMethods: {
      comparePassword(candidatePassword) {
        return bcrypt.compareAsync(candidatePassword, this.password)
      },
      toJSON() {
        return {
          id: this.id,
          name: this.name,
          email: this.email,
          gender: this.gender,
          location: this.location,
          abstract: this.abstract,
          picture: this.picture,
          talkTitle: this.talkTitle,
          title: this.title,
          affiliation: this.affiliation,
          bio: this.bio,
          contact: this.contact,
          address: this.address,
          speaker: this.speaker
        }
      }
    }
  })

  User.beforeCreate(hashPassword)
  // User.beforeUpdate(hashPassword)

  return User
}
