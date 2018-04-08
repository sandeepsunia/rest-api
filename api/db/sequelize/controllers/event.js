'use strict'

import { Models } from '../models'

const Track = Models.Track
const User = Models.User
const Schedule = Models.Schedule

export function createTrackEvent (req, res) {
  const { trackId, eventTitle, timeStart, timeEnd, fileName, status, speakers } = req.body
  let formData = req.body
  let image = ''
  if (fileName) {
    fileName.map(data => {
      if (data.field == 'file') {
        image = data.name
        formData.imageName = data.originalname
      } 
    })
  }
  if (trackId) {
    return Track.findOne({
      where: { id: trackId }
    })
    .then(track => {
      if (track == null) {
        return res.status(404).json({ success: false, message: `No track found, cannot create event.` })
      } else {
        return track.createEvent({
          title: eventTitle,
          status: status ? status : 'draft',
          image: image ? image : '',
          metadata: formData,
          schedule: {
            startDate: timeStart,
            endDate: timeEnd
          }
        }, {
          include: {
            model: Models.Schedule,
            as: 'schedule'
          }
        })
      }
    })
    .then((event) => {
      return speakers.split(',').map((speakerEmail) => {
        return User.findOne({
          where: {
            email: speakerEmail
          }
        })
        .then(user => {
          if (user) {
            event.addMember(user)
          }
        })
      })
    })
    .then((event) => {
      return res.status(200).json({ success: true, message: `Created Event Successfully.`, id: event.id })  
    })
    .catch(err => {
      return res.status(200).json({ success: false, message: `Something went wrong while creating event ${err.message}` })
    })
  } else {
    return res.status(400).json({success: false, message: `Track required for creating a event.`})
  }
}

function updateMetadata (formData, event) {
  formData.fileName = event.metadata.fileName
  formData.imageName = event.metadata.imageName
  return formData
}
export function updateEvent (req, res) {
  const { eventTitle, fileName, status, trackId, startDate, endDate, speakers} = req.body
  const { eventId } = req.params
  let formData = req.body
  let image = ''
  if (fileName) {
    fileName.map(data => {
      if (data.field == 'file') {
        image = data.name
        formData.imageName = data.originalname
      } 
    })
  }
  return Models.Event.scope().findOne({
    where: { id: eventId }
  })
  .then(event => {
    return event.update({
      title: eventTitle ? eventTitle : event.title,
      image: image ? image : event.image,
      status: status ? status : event.status,
      metadata: image ? formData : updateMetadata(formData, event),
      trackId: trackId ? trackId : event.trackId
    })
  })
  .then(event => {
    Schedule.findOne({
      where: {id: event.scheduleId}
    })
    .then(schedule => {
      return schedule.update({
        startDate: startDate,
        endDate: endDate
      })
    })
    return event
  })
  .then((event) => {
    return speakers.split(',').map((speakerEmail) => {
      return User.findOne({
        where: {
          email: speakerEmail
        }
      })
      .then(user => {
        if (user) {
          event.addMember(user)
        }
      })
    })
  })
  .then((event) => {
    return res.status(200).json({
      success: true,
      message: `Updated Event Data Successfully`,
      responseObject: {
        type: 'Event',
        count: 1,
        data: [
          event
        ]
      }
    })
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while updating event ${err.message}`})
  })
}

export function fetch (req, res) {
  const { eventId } = req.params

  return Models.Event.findOne({
    where: { id: eventId }
  }, {
    include: [{
      models: 'EventMembers',
      as: 'members'
    }, {
      models: 'Schedule'
    }]
  })
  .then(event => {
    if (event === null) {
      return [event, []]
    } else {
      return Promise.all([
        event,
        event.getMembers(),
        event.getSchedule()
      ])
    }
  })
  .then(response => {
    let event = response[0]
    let members = response[1]
    let schedule = response[2]
    if(event == null) {
      return res.status(404).json({ success: false, message: `No event found.` })
    } else {
      return res.status(200).json({
        success: true,
        message: 'Event',
        responseObject: {
          type: 'Event',
          count: 1,
          data: [
            {
              event: event,
              members: members,
              schedule: {
                startDate: schedule.startDate,
                endDate: schedule.endDate
              }
            }
          ]
        }
      })
    }
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while fetching event ${err.message}`})
  })
}

export function deleteById (req, res) {
  const { eventId } = req.params
  return Models.Event.scope().findOne({
    where: { id: eventId }
  })
  .then(event => {
    if(event == null) {
      return res.status(200).json({success: true, message: `Event with eventID ${eventId} does not exist in Events.`})
    } else {
      return event.update({
        status: 'deleted'
      })
      .then((event) => {
        return res.status(200).json({
          success: true,
          message: `Deleted Event Successfully`,
          responseObject: {
            type: 'Event',
            count: 1,
            data: [
              event
            ]
          }
        })
      })
    }
  })
 .catch(err => {
   return res.status(200).json({success: false, message: `Something went wrong while deleting event ${err.message}`})
 })
}

export function publish (req, res) {
  const { eventId } = req.params
  return Models.Event.scope('drafts').findOne({
    where: { id: eventId }
  })
  .then(event => {
    return event.update({
      status: 'published'
    })
  })
  .then((event) => {
    return res.status(200).json({
      success: true,
      message: `Published Event Successfully`,
      responseObject: {
        type: 'Event',
        count: 1,
        data: [
          event
        ]
      }
    })
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while publishing event ${err.message}`})
  })
}


export function joinWorkingGroup(req, res) {
  const { eventId } = req.params

  Models.WorkingGroup.findOne({
    where: {
      eventId: eventId,
      userId: req.user.id  
    }
  }).then(wg => {
    if (wg) {
      return res.status(200).json({success: true, message: `Already Subscribed`, responseObject: { type: 'WorkingGroup', count: 0 } })
    } else {
      return Models.WorkingGroup.create({
        eventId: eventId,
        userId: req.user.id
      }).then(workingGroup => {
        return res.status(200).json({
          success: true,
          message: `Created Working group successfully`,
          responseObject: {
            type: 'WorkingGroup',
            count: 1,
            data: [
              workingGroup
            ]
          }
        })
      }).catch(err => {
        return res.status(200).json({success: false, message: `Something went wrong ${err.message}`})
      })
    }
  })
}


export default {
  createTrackEvent,
  updateEvent,
  fetch,
  publish,
  deleteById,
  joinWorkingGroup
}
