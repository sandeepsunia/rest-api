'use strict'
/* eslint-env node, mocha */
process.env.NODE_ENV = 'test'

import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import Promise from 'bluebird'
import * as fixture from 'sequelize-fixtures'
import { agent  } from 'supertest'
import app from '../../api'


describe('Track API', () => {
  const request = agent(app)
  let token = null
  before((done) => {
    sequelize.sync()
      .then(() => {
        const fixtureModels = {
          User: Models.User,
          Role: Models.Role,
          UserRole: Models.UserRole,
          Schedule: Models.Schedule,
          Conference: Models.Conference
        }
        fixture.loadFiles([
          'test/fixtures/users.json',
          'test/fixtures/roles.json',
          'test/fixtures/user_roles.json',
          'test/fixtures/conferences.json'
        ], fixtureModels, {log: () => {}})  
        .then(() => {
          let email = 'angela_bond@test.com'
          let password = 'angela_bond'
          request.post(`/api/v1/user/login`)
            .set('Accept', 'application/json')
            .send({email: `${email}`, password: `${password}`})
            .end((err, res) => {
              token = res.body.responseObject.data[0].token
              done()
            })
        })
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    Promise.all([
      Models.User.destroy({
        paranoid: false,
        force: true,
        reset: true,
        where: {}
      }),
      Models.Role.destroy({
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
      Models.Conference.destroy({
        paranoid: false,
        force: true,
        reset: true,
        where: {}
      })
    ])
    .then(() => {
      return Promise.all([
        sequelize.query(`ALTER SEQUENCE "Users_id_seq" RESTART WITH 1`),
        sequelize.query(`ALTER SEQUENCE "Roles_id_seq" RESTART WITH 1`),
        sequelize.query(`ALTER SEQUENCE "Tracks_id_seq" RESTART WITH 1`),
        sequelize.query(`ALTER SEQUENCE "Conferences_id_seq" RESTART WITH 1`)
      ])
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it('[POST] /api/v1/track/create ==>  should not create a track if conference is not found', (done) => {
    request.post('/api/v1/track/create')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({conferenceId: 101, trackTitle: 'Not to be created Track'})
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        expect(res.body.success).to.be.false
        done()
      })
  })

  it('[POST] /api/v1/track/create ==>  should not create a track with bad request parameters', (done) => {
    request.post('/api/v1/track/create')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({trackTitle: 'Not to be created Track'})
      .expect(400)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        expect(res.body.success).to.be.false
        done()
      })
  })

  it('[POST] /api/v1/track/create ==>  should create a track tagged to the conference', (done) => {
    request.post('/api/v1/track/create')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({conferenceId: 1, trackTitle: 'Parent Track'})
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('should have a conference referenced', (done) => {
    Models.Track.findOne({ where: { id: 1} })
      .then(track => {
        return track.getConference()
      })
      .then(conference => {
        assert.exists(conference)
        done()
      })
      .catch(err => done(err))
  })

  it('[POST] /api/v1/track/:trackId/update ==>  should update track attributes', (done) => {
    request.post('/api/v1/track/1/update')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({trackTitle: 'Parent Track - Updated'})
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        assert.exists(res.body.responseObject)
        assert.exists(res.body.responseObject.data)
        expect(res.body.responseObject.data[0].title).to.be.equal('Parent Track - Updated')
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[GET] /api/v1/track/:trackId ==>  should fetch track by ID', (done) => {
    request.post('/api/v1/track/1')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        assert.exists(res.body.responseObject)
        assert.exists(res.body.responseObject.data)
        expect(res.body.responseObject.data[0].title).to.be.equal('Parent Track - Updated')
        expect(res.body.responseObject.type).to.be.equal('Track')
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[GET] /api/v1/track/:trackId ==>  should fetch track by ID', (done) => {
    request.post('/api/v1/track/111')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        expect(res.body.success).to.be.false
        done()
      })
  })

  it('[DELETE] /api/v1/track/:trackId/delete ==>  should delete the track', (done) => {
    request.delete('/api/v1/track/1/delete')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        expect(res.body.success).to.be.true
        done()
      })
  })

})
