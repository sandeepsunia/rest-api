'use strict'

import { Models } from '../../api/db/sequelize/models'
const csv = require('fast-csv')
let counter = 0
const password = 'nystar2017'
const trackId = 2;



csv
  .fromPath("day2.csv")
  .on("data", function (data) {
    if (counter > 0) {
      let startDate = `25-Oct-2017 ${data[0]}`
      let endDate = `25-Oct-2017 ${data[1]}`



      let title = data[2]
      let speakers = data[3]
      let description = data[4]
      let location = data[5]
      
      return Models.Track.findOne({
        where: {id: trackId}
      })
      .then(track => {
        return track.createEvent({
          title: title,
          status: 'published',
          metadata: {
            description: description,
            location: location,
            speakers: speakers
          },
          schedule: {
            startDate: startDate,
            endDate: endDate
          }
        }, {
          include: {
            model: Models.Schedule,
            as: 'schedule'
          }
        })
      })
      .then((event) => {
        console.log(`EVENT +============================== ${JSON.stringify(event)}`)
        return speakers.split(',').map((speakerEmail) => {
          return Models.User.findOne({
            where: {
              email: speakerEmail
            }
          })
          .then(user => {
            if (user) {
              event.addMember(user)
              console.log(`Added user ${user.name} to event`)
            }
          })
        })
      })
      .then(() => {
        console.log(`Done`)
      })
      .catch(e => {
        console.log(`Error`)
      })
      

    }
    counter += 1
  })
  .on("end", function () {
    console.log("done")
  })


