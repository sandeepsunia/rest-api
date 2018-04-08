import session from 'express-session'
import pg from 'pg'
import connectPostgres from 'connect-pg-simple'
import { db } from '../sequelize/constants'
import logger from '../../../utils/logger'

const PGStore = connectPostgres(session)

logger.info(`Connecting to DB with  ${db}`)

export default () =>
  new PGStore(
    {
      pg,
      conString: db
    }
)
