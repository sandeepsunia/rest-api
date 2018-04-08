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
      let params = {
        name: `${data[1]} ${data[2]}`,
        email: data[0],
        password: password,
        affiliation: data[3],
        title: data[4],
        contact: data[5],
        speaker: false
      }

      return Models.User.findOne({
        where: {email: data[0]}
      })
      .then(user => {
        if (user != null) {
          return Models.User.destroy({
            where: {id: user.id}
          }).then(() => {
            return Promise.all([
              Models.User.create(params),
              Models.Role.findOne({where: {name: defaultRole}})
            ])  
          })
        } else {
          return Promise.all([
            Models.User.create(params),
            Models.Role.findOne({where: {name: defaultRole}})
          ])
        }
      })
      .then(results => {
        let user = results[0]
        let role = results[1]
        if (role != null) {
          return user.addRole(role)
        } else {
          return user.createRole({name: defaultRole})
        }
      })
      .then((u) => {
        console.log(`Created ${u.name}`)
      })
      .catch(e => {
        console.log(`Error - ${e.message}`)
      })

    }
    counter += 1
  })
  .on("end", function () {
    console.log("done")
  })


