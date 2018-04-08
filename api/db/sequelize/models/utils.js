'use strict'

const buildPolicyUPN = (policy) => {
  policy.upn = `${policy.resource.toLowerCase()}::${policy.action}`
}

export {
  buildPolicyUPN
}