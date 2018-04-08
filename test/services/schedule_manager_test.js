'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { verifyEvents } from '../../services/schedule_manager'
import { assert, expect } from 'chai'
import * as fixture from 'sequelize-fixtures'

describe('Service: Schedule Manager', () => {

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
          'test/fixtures/schedule_manager.json'
        ], fixtureModels, {log: () => {}})
      })
      .then(() => {
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  after(done => {
    Promise.all([
      Models.Conference.destroy({
        paranoid: false,
        force: true,
        reset: true,
        where: {}
      }),
      Models.Track.destroy({
        paranoid: false,
        force: true,
        reset: true,
        where: {}
      }),
      Models.Event.destroy({
        paranoid: false,
        force: true,
        reset: true,
        where: {}
      })
    ])
    .then(() => {
      return Promise.all([
        sequelize.query(`ALTER SEQUENCE "Conferences_id_seq" RESTART WITH 1`),
        sequelize.query(`ALTER SEQUENCE "Tracks_id_seq" RESTART WITH 1`),
        sequelize.query(`ALTER SEQUENCE "Events_id_seq" RESTART WITH 1`)
      ])
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  
  it('should have exportable function #verifyEvents', (done) => {
    assert.exists(verifyEvents)
    done()
  })

  it('should return false for #verifyEvents for all Events since 2 events have clashing schedules', (done) => {
    Models.Event.findAll({})
      .then(events => {
        let verified = verifyEvents(events)
        expect(verified).to.be.false
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})