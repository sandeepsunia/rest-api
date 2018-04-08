'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import Promise from 'bluebird'
import * as fixture from 'sequelize-fixtures'
import * as _ from 'lodash'

describe('Model: Track', () => {
  before((done) => {
    sequelize.sync({force: true})
      .then(() => {
        const fixtureModels = {
          Schedule: Models.Schedule,
          Conference: Models.Conference,
          Track: Models.Track
        }
        return fixture.loadFiles([
          'test/fixtures/tracks.json'
        ], fixtureModels, {log: () => {}})
      })
      .then(() => {
        return done()
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    Models.Track.destroy({
      paranoid: false,
      force: true,
      reset: true,
      where: {}
    })
    .then(() => {
      return sequelize.query(`ALTER SEQUENCE "Tracks_id_seq" RESTART WITH 1`)
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  
  it('should exist', (done) => {
    assert.exists(Models.Track)
    done()
  })

  it('should have multiple sub tracks', (done) => {
    Models.Track.findOne({
      where: {id: 1}
    })
    .then(masterTrack => {
      return masterTrack.getChildTracks()
    })
    .then(childTracks => {
      const validTrackTitles = [ 'Track 1 - Day 1', 'Track 1 - Day 2' ]
      assert.exists(childTracks)
      childTracks.map(childTrack => {
        expect(validTrackTitles.includes(childTrack.title)).to.be.true
      })
      expect(childTracks.length).to.be.eq(2)
      return done()
    })
    .catch(err => {
      return done(err)
    })
  })

})