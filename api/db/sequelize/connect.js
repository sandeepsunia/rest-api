import { sequelize } from './models'
import logger from '../../../utils/logger'

export default () => {
  sequelize
    .authenticate()
    .then(() => {
      logger.info('Successfully connected to sequelize database')
    }, (err) => {
      logger.debug('Unable to connect to the sequelize database: ', err)
    })
}
