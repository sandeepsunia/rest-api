'use strict'

import Promise from 'bluebird'
import { Models } from '../models'

const Role = Models.Role

export function create(req, res) {
  const { roleName } = req.body
  return Role.create({
    name: roleName
  })
  .then(role => {
    return res.status(201).json({success: true, message: `Created Role Successfully - ${role.name}`})
  })
  .catch(err => {
    return res.status(500).json({success: true, message: `Something went wrong - ${err.message}`})
  })
}

export function addPolicy (req, res) {
  const { roleId, policyId, policyUPN, policyType } = req.body

  if (!(roleId != undefined) || !(policyType != undefined) || !((policyId != undefined) || (policyUPN != undefined))) {
    return res.status(400).json({ success: false, message: `Role and Policy ID/UPN are required` })
  }

  let policyModel = Models[`${policyType}Policy`]
  let policyQuery = null
  if (policyUPN !== undefined) {
    policyQuery = {where: { upn: policyUPN }}
  } else if (policyId !== undefined) {
    policyQuery = {where: { id: policyId }}
  }

  Promise.all([
    Role.findOne({
      where: { id: roleId }
    }),
    policyModel.findOne(policyQuery)
  ])
  .then(roleAndPolicies => {
    let role = roleAndPolicies[0]
    let policy = roleAndPolicies[1]
    if (role) {
      return role[`add${policyType}Policy`](policy)
        .then(() => {
          return res.status(201).json({ success: true, message: `Successfully created policy` })
        })
    } else {
      return res.status(404).json({ success: false, message: `Role Not found` })
    }
  })
  .catch((err) => {
    return res.status(200).json({ success: false, message: `Somethign went wrong - ${JSON.stringify(err)}` })
  })
}

export default {
  create,
  addPolicy
}
