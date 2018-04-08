'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import Promise from 'bluebird'
import * as fixture from 'sequelize-fixtures'
import * as _ from 'lodash'
import logger from '../../utils/logger'

describe('Model: Schedule', () => {
  before((done) => {
    sequelize.sync({force: true})
      .then(() => {
        const fixtureModels = {
          Schedule: Models.Schedule,
          Conference: Models.Conference,
          Track: Models.Track,
          Event: Models.Event
        }
        return fixture.loadFiles([
          'test/fixtures/schedules.json'
        ], fixtureModels, {log: () => {}})
      })
      .then(() => {
        return Promise.all([
          Models.Schedule.findOne({where: {id: 10}}),
          Models.Schedule.findOne({where: {id: 11}}),
          Models.Schedule.findOne({where: {id: 12}}),
          Models.Conference.findOne({where: {id: 1}}),
          Models.Track.findOne({where: {id: 1}}),
          Models.Event.findOne({where: {id: 1}})
        ])
      })
      .then(scheduleConference => {
        let confSchedule = scheduleConference[0]
        let trackSchedule = scheduleConference[1]
        let eventSchedule = scheduleConference[2]
        let conference = scheduleConference[3]
        let track = scheduleConference[4]
        let event = scheduleConference[5]
        return Promise.all([
          confSchedule.setConference(conference).return(confSchedule),
          trackSchedule.setTrack(track).return(trackSchedule),
          eventSchedule.setEvent(event).return(eventSchedule)
        ])
      })
      .then((schedules) => {
        let confSchedule = schedules[0]
        let trackSchedule = schedules[0]
        let eventSchedule = schedules[0]
        
        assert.exists(confSchedule)
        assert.exists(confSchedule.startDate)
        assert.exists(confSchedule.endDate)

        assert.exists(trackSchedule)
        assert.exists(trackSchedule.startDate)
        assert.exists(trackSchedule.endDate)

        assert.exists(eventSchedule)
        assert.exists(eventSchedule.startDate)
        assert.exists(eventSchedule.endDate)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    Models.Schedule.destroy({
      paranoid: false,
      force: true,
      reset: true,
      where: {}
    })
    .then(() => {
      return sequelize.query(`ALTER SEQUENCE "Schedules_id_seq" RESTART WITH 1`)
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  
  it('should exist', (done) => {
    assert.exists(Models.Conference)
    done()
  })

  it('should have a conference when associated', done => {
    Models.Schedule.findOne({
      where: {
        id: 10
      }
    }).then(schedule => {
      assert.exists(schedule)
      assert.exists(schedule.startDate)
      assert.exists(schedule.endDate)
      return schedule.getConference()
    })
    .then(conference => {
      assert.exists(conference)
      assert.exists(conference.title)
      expect(conference.title).to.be.equal('Test Conf')
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it('should have a track when associated', done => {
    Models.Schedule.findOne({
      where: {
        id: 11
      }
    }).then(schedule => {
      assert.exists(schedule)
      assert.exists(schedule.startDate)
      assert.exists(schedule.endDate)
      return schedule.getTrack()
    })
    .then(track => {
      assert.exists(track)
      assert.exists(track.title)
      expect(track.title).to.be.equal('Test Track')
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it('should have a event when associated', done => {
    Models.Schedule.findOne({
      where: {
        id: 12
      }
    }).then(schedule => {
      assert.exists(schedule)
      assert.exists(schedule.startDate)
      assert.exists(schedule.endDate)
      return schedule.getEvent()
    })
    .then(event => {
      assert.exists(event)
      assert.exists(event.title)
      expect(event.title).to.be.equal('Test Event')
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it('should not return a conference & track when associated to event', done => {
    Models.Schedule.findOne({
      where: {
        id: 12
      }
    }).then(schedule => {
      assert.exists(schedule)
      assert.exists(schedule.startDate)
      assert.exists(schedule.endDate)
      return Promise.all([
        schedule.getConference(),
        schedule.getTrack()
      ])
    })
    .then(conferenceTrack => {
      let conference = conferenceTrack[0]
      let track = conferenceTrack[1]
      assert.notExists(conference)
      assert.notExists(track)
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it('should not return a conference & event when associated to track', done => {
    Models.Schedule.findOne({
      where: {
        id: 11
      }
    }).then(schedule => {
      assert.exists(schedule)
      assert.exists(schedule.startDate)
      assert.exists(schedule.endDate)
      return Promise.all([
        schedule.getConference(),
        schedule.getEvent()
      ])
    })
    .then(conferenceTrack => {
      let conference = conferenceTrack[0]
      let event = conferenceTrack[1]
      assert.notExists(conference)
      assert.notExists(event)
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it('should not return a track & event when associated to conference', done => {
    Models.Schedule.findOne({
      where: {
        id: 10
      }
    }).then(schedule => {
      assert.exists(schedule)
      assert.exists(schedule.startDate)
      assert.exists(schedule.endDate)
      return Promise.all([
        schedule.getTrack(),
        schedule.getEvent()
      ])
    })
    .then(conferenceTrack => {
      let track = conferenceTrack[0]
      let event = conferenceTrack[1]
      assert.notExists(track)
      assert.notExists(event)
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it('should have mandatory attributes', done => {
    Models.Schedule.findAll({})
      .then(schedules => {
        let schedule = _.first(schedules)
        assert.exists(schedule.startDate)
        assert.exists(schedule.endDate)
        return schedule.getConference()
      })
      .then(conference => {
        assert.exists(conference)
        assert.exists(conference.scheduleId)
        assert.exists(conference.title)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should have conference attached', done => {
    Models.Schedule.findAll({})
      .then(schedules => {
        let schedule = _.first(schedules)
        return schedule.getConference()
      })
      .then(conference => {
        assert.exists(conference)
        expect(conference.title).to.equal('Test Conf')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

})