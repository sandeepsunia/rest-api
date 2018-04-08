'use strict'

import { Models } from '../../api/db/sequelize/models'
const csv = require('fast-csv')
let counter = 0
const password = 'nystar2017'
const defaultRole = 'guest'

csv
  .fromPath("speaker.csv")
  .on("data", function (data) {
    if (counter > 0) {
      let params = {
        name: `${data[1]} ${data[2]}`,
        email: data[0],
        picture: data[3],
        title: data[4],
        affiliation: data[5],
        bio: data[6],
        speaker: true
      }

      let params1 = {
        name: `${data[1]} ${data[2]}`,
        email: data[0],
        password: password,
        picture: data[3],
        title: data[4],
        affiliation: data[5],
        bio: data[6],
        speaker: true
      }

      return Models.User.findOne({
        where: {email: data[0]}
      })
      .then(user => {
        if (user != null) {
          return Promise.all([
            user.update(params),
            Models.Role.findOne({where: {name: defaultRole}})
          ])
        } else {
          return Promise.all([
            Models.User.create(params1),
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


