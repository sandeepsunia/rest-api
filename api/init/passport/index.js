'use strict'

import passport from 'passport'
import token from './token'
import { passport as dbPassport } from '../../db'
import unsupportedMessage from '../../db/unsupportedMessage'
import logger from '../../../utils/logger'

export default () => {
  if (dbPassport && dbPassport.deserializeUser) {
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })
    passport.deserializeUser(dbPassport.deserializeUser)
  } else {
    logger.debug(unsupportedMessage(`(de)serialize User`))
  } 
  token(passport)
}
