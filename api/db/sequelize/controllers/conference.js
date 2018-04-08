'use strict'

import { Models } from '../models'
import Promise from 'bluebird'
//import _ from 'lodash'

const Conference = Models.Conference
const Schedule = Models.Schedule

export function create (req, res) {
  const { conferenceName, abbreviation, description, url, fileName, startDate, endDate } = req.body
  let formData = req.body
  
  let image = ''
  if (fileName) {
    fileName.map(data => {
      if (data.field == 'file') {
        image = data.name
        formData.conferenceImageName = data.originalname
      } else if (data.field == 'organiserLogo') {
        formData.organiserLogoImage = data.name
        formData.organiserLogoName = data.originalname
      } else if (data.field == 'conferenceLogo') {
        formData.conferenceLogoImage = data.name
        formData.conferenceLogoName = data.originalname
      } else if (data.field == 'sponsorLogo') {
        formData.sponsorLogoImage = data.name
        formData.sponsorLogoName = data.originalname
      }
    })
  }
  return Conference.create({
    title: conferenceName,
    image: image ? image : '',
    abbreviation: abbreviation,
    description: description,
    url: url,
    venue: formData,
    organiser: formData,
    metadata: formData,
    active: true,
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
  .then(conference => {
    return res.json({success: true, message: `Created Conference Successfully - ${conference.title}`})
  })
  .catch(err => {
    return res.json({success: false, message: `Something went wrong while creating conference ${err.message}`})
  })
}

export function update (req, res) {
  const { conferenceName, abbreviation, description, url, fileName, startDate, endDate} = req.body
  const { conferenceId } = req.params
  let formData = req.body
  let image = ''
  if (fileName) {
    fileName.map(data => {
      if (data.field == 'file') {
        image = data.name
        formData.conferenceImageName = data.originalname
      } else if (data.field == 'organiserLogo') {
        formData.organiserLogoImage = data.name
        formData.organiserLogoName = data.originalname
      } else if (data.field == 'conferenceLogo') {
        formData.conferenceLogoImage = data.name
        formData.conferenceLogoName = data.originalname
      } else if (data.field == 'sponsorLogo') {
        formData.sponsorLogoImage = data.name
        formData.sponsorLogoName = data.originalname
      }
    })
  }
  Conference.findOne({
    where: { id: conferenceId }
  })
  .then(conference => {
    formData.conferenceImageName = formData.conferenceImageName ? formData.conferenceImageName : conference.metadata ? conference.metadata.conferenceImageName : ''
    formData.organiserLogoImage = formData.organiserLogoImage ? formData.organiserLogoImage : conference.organiser ? conference.organiser.organiserLogoImage : ''
    formData.organiserLogoName = formData.organiserLogoName ? formData.organiserLogoName : conference.organiser ? conference.organiser.organiserLogoName : ''
    formData.conferenceLogoImage = formData.conferenceLogoImage ? formData.conferenceLogoImage : conference.metadata ? conference.metadata.conferenceLogoImage : ''
    formData.conferenceLogoName = formData.conferenceLogoName ? formData.conferenceLogoName : conference.metadata ? conference.metadata.conferenceLogoName : ''
    formData.sponsorLogoImage = formData.sponsorLogoImage ? formData.sponsorLogoImage : conference.metadata ? conference.metadata.sponsorLogoImage : ''
    formData.sponsorLogoName = formData.sponsorLogoName ? formData.sponsorLogoName : conference.metadata ? conference.metadata.sponsorLogoName : ''
    return conference.update({
      title: conferenceName ? conferenceName : conference.title,
      image: image ? image : conference.image,
      abbreviation: abbreviation ? abbreviation : conference.abbreviation,
      description: description ? description : conference.description,
      url: url ? url : conference.url,
      venue: formData,
      organiser: formData,
      metadata: formData,
      active: true
    })
  })
  .then(conference => {
    return Promise.all([Schedule.findOne({
      where: {id: conference.scheduleId}
    })
    .then(schedule => {
      return schedule.update({
        startDate: startDate,
        endDate: endDate
      })
    }), conference
    ])
  })
  .then(conference => {
    return res.status(200).json({
      success: true,
      message: `Updated Conference Successfully`,
      responseObject: {
        type: 'Conference',
        count: 1,
        data: [
          conference
        ]
      }
    })
  })
  .catch((err) => {
    return res.status(200).json({success: false, message: `Something went wrong while updating conference ${err.message}`})
  })
}



export function fetchById (req, res) {
  const { conferenceId } = req.params
  return Conference.findOne({
    where: { id:  conferenceId }, 
  }, {
    include: {
      model: Models.Schedule,
      as: 'schedule'
    }
  })
  .then(conf => {
    return Promise.all([
      conf,
      conf.getSchedule()
    ])
  })
  .then(result => {
    let conference = result[0].toJSON()
    conference['schedule'] = result[1]
    return res.status(200).json({
      success: true,
      message: `Conference Resource`,
      responseObject: {
        type: 'Conference',
        count: 1,
        data: [
          conference
        ]
      }
    })
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while fetching conference ${err.message}`})
  })
}

export function deleteById (req, res) {
  const { conferenceId } = req.params
  return Conference.destroy({
    where: { id: conferenceId}
  })
  .then(() => {
    return res.status(200).json({success: true, message: `Deleted Conference Successfully`})
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while deleting conference ${err.message}`})
  })
}

export function getAllEvents (req, res) {
  const { conferenceId } = req.params
  const { tag, trackId } = req.query

  if ( ( tag == '' && trackId == '' ) || ( tag == '' && trackId === undefined ) || ( tag === undefined && trackId == '' )) {
    return res.status(400).send({ success: false, message: `Provide search text or track filter.` })
  } 
  else {
    return Models.Conference.find({
      where: {id: conferenceId}
    }, {
      include: [{
        model: Models.Track,
        as: 'tracks',
        include: {
          models: Models.Event,
          as: 'events',
          include: {
            models: 'EventMembers',
            as: 'members'
          }
        }
      }, {
        model: Models.Schedule
      }]
    })
    .then(conference => {
      return conference.getTracks( trackId ? { where: { id: trackId } } : {})
    })
    .then(tracks => {
      return Promise.map(tracks, (track) => {
        return track.getEvents( tag ? { where: { title: { $ilike: `%${tag}%` } } } : {} )
        .then(trackEvents => {
          return Promise.map(trackEvents, event => {
            return Promise.all([
              event.getMembers(),
              event.getSchedule()
            ]).then(result => {
              let members = result[0]
              let schedule = result[1]
              return {
                event: event,
                members: members,
                schedule: schedule
              }
            })
          })
        })
      })
    })
    .then(trackEvents => {
      return trackEvents.map(events => {
        return events.sort((a, b) => {
          return new Date(a.schedule.startDate) - new Date(b.schedule.startDate)
        })
      })
    })
    .then(events => {
      return res.json({success: true, message: `Conference events`, responseObject: {
        data: events
      }})
    })
    .catch(err => {
      return res.status(200).json({success: false, message: `Something went wrong while fetching events ${err.message}`})
    })
  }
}

export function getAllDrafts (req, res) {
  const { conferenceId } = req.params
  return Models.Conference.find({
    where: {id: conferenceId}
  }, {
    include: [{
      model: Models.Track,
      as: 'tracks',
      include: {
        models: Models.Event,
        as: 'events',
        include: {
          models: 'EventMembers',
          as: 'members'
        }
      }
    }, {
      model: Models.Schedule
    }]
  })
  .then(conference => {
    return conference.getTracks()
  })
  .then(tracks => {
    return Promise.map(tracks, (track) => {
      return track.getEvents( {scope: 'drafts'} )
      .then(trackEvents => {
        return Promise.map(trackEvents, event => {
          return Promise.all([
            event.getMembers(),
            event.getSchedule()
          ]).then(result => {
            let members = result[0]
            let schedule = result[1]
            return {
              event: event,
              members: members,
              schedule: schedule
            }
          })
        })
      })
    })
  })
  .then(trackEvents => {
    return trackEvents.map(events => {
      return events.sort((a, b) => {
        return new Date(a.schedule.startDate) - new Date(b.schedule.startDate)
      })
    })
  })
  .then(events => {
    return res.json({success: true, message: `Conference events`, responseObject: {
      data: events
    }})
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while fetching events ${err.message}`})
  })
}

function getTracks(req, res) {
  const { conferenceId } = req.params
  const { parentId } = req.query
  return Models.Conference.find({
    where: {id: conferenceId}
  }, {
    include: {
      model: Models.Track,
      as: 'tracks'
    }
  })
  .then((conference) => {
    return conference.getTracks( parentId!=0 && parentId ? { where: { parentTrackId: parentId } } : {})
  })
  .then((tracks) => {
    res.status(200).json({
      success: true,
      message: `tracks for conference`,
      responseObject: {
        count: tracks.length,
        data: tracks
      }
    })
  })
  .catch((err) => {
    return res.status(200).json({success: false, message: `Something went wrong while fetching tracks ${err.message}`})
  })
}

function getActiveConferenceLatest(req, res) {
  return Models.Conference.findOne({
    where: {
      active: true
    },
    order: [['id', 'DESC']]
  }).then(conference => {
    if(conference != null) {
      return res.status(200).json({
        success: true,
        responseObject: {
          data: [{
            conferenceId: conference.id
          }]
        }
      })
    } else {
      return res.status(200).json({
        success: true,
        responseObject: {
          data: [{}]
        }
      })
    }
  })
}

export default {
  create,
  update,
  fetchById,
  deleteById,
  getAllEvents,
  getAllDrafts,
  getTracks,
  getActiveConferenceLatest
}
