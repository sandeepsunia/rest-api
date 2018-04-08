'use strict'

import Promise from 'bluebird'
import _ from 'lodash'
import { Models } from '../api/db/sequelize/models'

const User = Models.User

export function getPolicies (userId) {
  return new Promise((resolve, reject) => {
    return User.findOne({ id: userId }).then(user => user.getRoles())
      .then(roles => {
        return Promise.map(roles, (role) => {
          return Promise.all([
            role.getAllowedPolicies(),
            role.getDeniedPolicies(),
            role.getInlinePolicies()
          ]).then(policies => {
            let allowedPolicies = policies[0]
            let deniedPolicies = policies[1]
            let inlinePolicies = policies[2]
            return {
              allowed: _.map(allowedPolicies, (policy) => {return policy.upn}),
              denied: _.map(deniedPolicies, (policy) => {return policy.upn}),
              inline: _.map(inlinePolicies, (policy) => {return policy.upn}),
            }
          })
        })
      })
      .then(policiesAllRoles => {
        let policies = {
          allowed: [],
          denied: [],
          inline: []
        }
        _.map(policiesAllRoles, (rolePolicies) => {
          let allowedUPNs = rolePolicies.allowed
          let deniedUPNs = rolePolicies.denied
          let inlineUPNs = rolePolicies.inline
          policies['allowed'] = _.union(policies.allowed, allowedUPNs)
          policies['denied'] = _.union(policies.denied, deniedUPNs)
          policies['inline'] = _.union(policies.inline, inlineUPNs)
        })
        return resolve(policies)
      })
      .catch(err => {
        return reject(err)
      })
  })
}

export default {
  getPolicies
}