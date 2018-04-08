'use strict'

import _ from 'lodash'
import Promise from 'bluebird'
import { Models, Resources } from '../../api/db/sequelize/models'
import { controllers } from '../../api/db'
import logger from '../../utils/logger'

const invalidResources = ["UserRole"]
const mergedResources = _.reject(Resources, (resource) => _.includes(invalidResources, resource))

const crudActions = [
  "*",
  "create",
  "read",
  "update",
  "delete"
]

function createPolicies (policyModel, type) {
  return Promise.map(policyModel.actions, (action) => {
    return Models[`${type}Policy`].create({
      resource: policyModel.resource,
      action: action.toLowerCase()
    })
  })
}

export function createAllPolicies() {
  return _.map(mergedResources, (resource) => {
    let controller = controllers[resource.toLowerCase()]
    let actions = crudActions
    if (controller !== undefined) {
      actions = actions.concat(Object.keys(controller))
    }
    return Promise.all([
      createPolicies({ resource: resource, actions: actions }, 'Allowed'),
      createPolicies({ resource: resource, actions: actions }, 'Denied'),
      createPolicies({ resource: resource, actions: actions }, 'Inline')
    ])
    .then(() => {
      logger.info('done')
    })
    .catch(() => {
      logger.debug('errored')
    })
  })
}

export default {
  createAllPolicies
}
