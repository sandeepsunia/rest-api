'use strict'

import { Models } from '../models'

const Conference = Models.Conference

export function createConferenceTrack (req, res) {
  const { conferenceId, trackTitle, startDate, endDate, parentId } = req.body
  if (conferenceId) {
    return Conference.findOne({
      where: { id: conferenceId }
    })
    .then(conference => {
      if (conference == null) {
        return res.status(404).json({ success: false, message: `No conference found, cannot create track.` })
      } else {
        return conference.createTrack({
          title: trackTitle,
          parentTrackId: parentId ? parentId : 0,
          schedule: {
            startDate: startDate ? startDate : new Date(),
            endDate: endDate ? endDate : new Date()
          }
        }, {
          include: {
            model: Models.Schedule,
            as: 'schedule'
          }
        }).then(() => {
          return res.status(200).json({ success: true, message: `Created Track Successfully.` })  
        })
      }
    })
    .catch(err => {
      return res.status(200).json({ success: false, message: `Something went wrong while creating track ${err.message}` })
    })
  } else {
    return res.status(400).json({success: false, message: `Conference required for creating a track.`})
  }
}

export function createMultipleConferenceTrack (req, res) {
  const { conferenceId, scheduleFrom, scheduleTo, count } = req.body
  let returnValue = ''
  if (conferenceId) {
    if (count) {
      for ( let i=1; i <= count; i++ ) {
        returnValue = Conference.findOne({
          where: { id: conferenceId }
        })
        .then(conference => {
          if (conference == null) {
            return 1
          } else {
            return conference.createTrack({
              title: `Day${i}`,
              schedule: {
                startDate: scheduleFrom,
                endDate: scheduleTo
              }
            }, {
              include: {
                model: Models.Schedule,
                as: 'schedule'
              }
            }).then(() => {
              return 2
            })
          }
        })
        .catch(err => {
          return err.message
        })
        if (returnValue == 2) {
          continue
        } else {
          continue
        }
      }
    } else {
      return res.status(400).json({success: false, message: `Count of tracks required for creating multiple tracks.`})
    }
  } else {
    return res.status(400).json({success: false, message: `Conference required for creating multiple tracks.`})
  }
  if (returnValue == 2) { 
    return res.status(200).json({ success: true, message: `Created Track Successfully.` })
  } else if (returnValue == 1) {
    return res.status(404).json({ success: false, message: `No conference found, cannot create tracks.` })
  } else {
    return res.status(200).json({ success: true, message: `Created Track Successfully.` })
    //return res.status(200).json({ success: false, message: `Something went wrong while creating track ${returnValue}` })
  }
}

export function updateTrack (req, res) {
  const { trackTitle } = req.body
  const { trackId } = req.params

  return Models.Track.findOne({
    where: { id: trackId }
  })
  .then(track => {
    return track.update({
      title: trackTitle
    })
  })
  .then((track) => {
    return res.status(200).json({
      success: true,
      message: `Updated Track Data Successfully`,
      responseObject: {
        type: 'Track',
        count: 1,
        data: [
          track
        ]
      }
    })
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while updating track ${err.message}`})
  })
}

export function fetch (req, res) {
  const { trackId } = req.params


  return Models.Track.findOne({
    where: { id: trackId }
  })
  .then(track => {
    if(track == null) {
      return res.status(404).json({ success: false, message: `No track found.` })
    } else {
      return res.status(200).json({
        success: true,
        message: 'Track',
        responseObject: {
          type: 'Track',
          count: 1,
          data: [
            track
          ]
        }
      })
    }
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while fetching track ${err.message}`})
  })
}

export function deleteById (req, res) {
  const { trackId } = req.params
  return Models.Track.destroy({
    where: { id: trackId}
  })
  .then(() => {
    return res.status(200).json({success: true, message: `Deleted Track Successfully`})
  })
  .catch(err => {
    return res.status(200).json({success: false, message: `Something went wrong while deleting track ${err.message}`})
  })
}

export default {
  createConferenceTrack,
  updateTrack,
  fetch,
  deleteById
}
