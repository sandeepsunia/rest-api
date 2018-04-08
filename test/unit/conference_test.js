'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import * as fixture from 'sequelize-fixtures'
import * as _ from 'lodash'

describe('Model: Conference', () => {
  before((done) => {
    sequelize.sync({force: true})
      .then(() => {
        const fixtureModels = {
          Schedule: Models.Schedule,
          Conference: Models.Conference
        }
        return fixture.loadFiles([
          'test/fixtures/conferences.json'
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
    Models.Conference.destroy({
      paranoid: false,
      force: true,
      reset: true,
      where: {}
    })
    .then(() => {
      return sequelize.query(`ALTER SEQUENCE "Conferences_id_seq" RESTART WITH 1`)
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

  it('should have mandatory attributes & schedule attached with valid attributes', done => {
    Models.Conference.findAll({})
      .then(conferences => {
        let conference = _.first(conferences)
        assert.exists(conference.title)
        assert.exists(conference.scheduleId)
        return conference.getSchedule()
      })
      .then(schedule => {
        assert.exists(schedule)
        assert.exists(schedule.id)
        assert.exists(schedule.startDate)
        assert.exists(schedule.endDate)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

})