/*eslint-env node*/
import Sequelize from 'sequelize'
import sequelizeConfig from '../sequelize_config'
import { ENV } from '../../../../config/env'
import userModel from './user'
import tokenModel from './token'
import roleModel from './role'
import userRoleModel from './user_role'
import allowedPolicyModel from './allowed_policy'
import deniedPolicyModel from './denied_policy'
import inlinePolicyModel from './inline_policy'
import conferenceModel from './conference'
import trackModel from './track'
import eventModel from './event'
import scheduleModel from './schedule'
import workingGroupModel from './working_groups'

const config = sequelizeConfig[ENV]

const db = {}
const dbUrl = process.env[config.use_env_variable]

const sequelize = dbUrl ? new Sequelize(dbUrl) : new Sequelize(config.database, config.username, config.password, config)

db.User = sequelize.import('User', userModel)
db.Token = sequelize.import('Token', tokenModel)
db.Role = sequelize.import('Role', roleModel)
db.UserRole = sequelize.import('UserRole', userRoleModel)
db.AllowedPolicy = sequelize.import('AllowedPolicy', allowedPolicyModel)
db.DeniedPolicy = sequelize.import('DeniedPolicy', deniedPolicyModel)
db.InlinePolicy = sequelize.import('InlinePolicy', inlinePolicyModel)
db.Conference = sequelize.import('Conference', conferenceModel)
db.Track = sequelize.import('Track', trackModel)
db.Event = sequelize.import('Event', eventModel)
db.Schedule = sequelize.import('Schedule', scheduleModel)
db.WorkingGroup = sequelize.import('WorkingGroup', workingGroupModel)

Object.keys(db).forEach((key) => {
  const model = db[key]
  if (model.associate) {
    model.associate(db)
  }
})

const resources = Object.keys(db)

export {
  db as Models,
  resources as Resources,
  sequelize
}
