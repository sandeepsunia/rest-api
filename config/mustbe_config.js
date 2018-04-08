'use strict'

import { Models } from '../api/db/sequelize/models'
import _ from 'lodash'

const User = Models.User

export default (config) => {
  config.routeHelpers((rh) => {
    rh.getUser((req, cb) => {
      cb(null, req.user)
    })
    rh.notAuthorized(function(req, res){
      return res.status(210).send({ success: false, message: `Authentication failed. User not found` })
    })
  })

  config.activities((activities) => {
    activities.can(`user.readAll`, (identity, params, cb) => {
      let isAuthorized = true
      return cb(null, isAuthorized)
    })

    activities.can('admin', (identity, params, cb) => {
      let user = identity.user
      User.findOne({
        id: user.id
      })
      .then(user => {
        return user.getRoles()
      })
      .then(roles => {
        let matchingRole = _.filter(roles, (o) => { return o.name == 'admin' })
        if (matchingRole) {
          cb(null, true)
        } else {
          cb(null, false)
        }
      })
      .catch(err => {
        cb(err)
      })
    })
  })
}