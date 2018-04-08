'use strict'

import { Models } from '../models'

export function addResourcePolicy (req, res) {
  const resource = req.body.resource
  const action = req.body.action
  const policyType = req.body.policyType
  
  if (!policyType || !resource || !action) {
    return res.status(400).json({ success: false, message: `Resource and action both are required to build a policy` })
  }

  let resourceModel = Models[resource]
  let model = Models[`${policyType}Policy`]

  if (model !== undefined && resourceModel !== undefined) {
    model.create({
      resource: resource.toLowerCase(),
      action: action.toLowerCase()
    })
    .then(policy => {
      return res.status(201).json({ success: true, message: `Successfully created policy ${policy.upn}` })
    })
    .catch((err) => {
      return res.status(200).json({ success: false, message: `Something went wrong in creating policy ${JSON.stringify(err)}` })
    })
  } else {
    return res.status(404).json({ success: false, message: `Resource not found` })
  }

}

export default {
  addResourcePolicy
}