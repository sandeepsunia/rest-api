import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { passport as dbPassport } from '../../db'
import unsupportedMessage from '../../db/unsupportedMessage'
import { apiSecret } from '../../../config/secrets'
import logger from '../../../utils/logger'

export default (passport) => {
  if (!dbPassport || !dbPassport.token || !typeof dbPassport.token === 'function') {
    logger.debug(unsupportedMessage(`passport-jwt`))
    return
  }

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: apiSecret
  }

  passport.use('jwt', new JwtStrategy(opts, dbPassport.token))
}
