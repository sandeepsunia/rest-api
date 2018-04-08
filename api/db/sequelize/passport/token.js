'use strict'

import { Models } from '../models'
import Promise from 'bluebird'

const User = Models.User

export default (jwtPayload, done) => {

  User.findOne({ where: { email: jwtPayload.email } })
    .then(user => {
      return Promise.all([
        user,
        user.getToken()
      ])
    })
    .then((userTokens) => {
      let user = userTokens[0]
      let token = userTokens[1]
      
      if (token == null) {
        return done(null, false, { message: `There is no record of the email ${user.email}.` })
      } else {
        return done(null, user)
      }
    })
    .catch(() => {
      done(null, false, { message: `Something went wrong to authenticate user` })
    })
}
