'use strict'

import Promise from 'bluebird'
import _ from 'lodash'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

export function verifyEvents(events) {
  let verified = false
  for (let i = 0; i <= events.length - 1; i++) {
    for (let j = 1; j <= events.length - 1; j++) {
      let firstEventSchedule = events[i].getSchedule()
      let secondEventSchedule = events[j].getSchedule()

      let firstStartDateTime = Date.parse(firstEventSchedule.startDate)
      let firstEndDateTime = Date.parse(firstEventSchedule.endDate)
      let firstRange = moment.range(firstStartDateTime, firstEndDateTime)
      
      let secondStartDateTime = Date.parse(secondEventSchedule.startDate)
      let secondEndDateTime = Date.parse(secondEventSchedule.endDate)
      let secondRange = moment.range(secondStartDateTime, secondEndDateTime)
      verified = verified ||  firstRange.adjacent(secondRange) || secondRange.adjacent(firstRange)
    }
  }
  return verified
}

export default {
  verifyEvents
}