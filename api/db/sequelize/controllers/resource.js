'use strict'

import { Models } from '../models'

export function getResources (req, res) {
  let resources = Object.keys(Models)
  res.status(200).send({ 
    success: true,
    message: 'All resources',
    responseObject: {
      type: 'Resource',
      count: resources.length,
      data: resources
    }})
}

export default {
  getResources
}
