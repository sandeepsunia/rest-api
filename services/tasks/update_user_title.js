'use strict'

import { Models } from '../../api/db/sequelize/models'
const csv = require('fast-csv')
let counter = 0
const password = 'nystar2017'
const defaultRole = 'guest'

csv
  .fromPath("users.csv")
  .on("data", function (data) {
    if (counter > 0) {
      let email = data[0]
      let params = {
        affiliation: data[3],
        title: data[4],
      }

      return Models.User.findOne({
        where: {
          email: data[0]
        }
      })
      .then(user => {
        user.update(params)
      })
      .then(() => {
        console.log(`Updated`)
      })
      .catch(e => {
        console.log('error')
      })

    }
    counter += 1
  })
  .on("end", function () {
    console.log("done")
  })


