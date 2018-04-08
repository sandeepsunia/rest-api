'use strict'
/* eslint-env node, mocha */
process.env.NODE_ENV = 'test'

import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import Promise from 'bluebird'
import * as fixture from 'sequelize-fixtures'
import { agent  } from 'supertest'
import app from '../../api'


describe('Event API', () => {
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
          Conference: Models.Conference,
          Track: Models.Track,
          Event: Models.Event
        }
        fixture.loadFiles([
          'test/fixtures/users.json',
          'test/fixtures/roles.json',
          'test/fixtures/user_roles.json',
          'test/fixtures/tracks_api.json'
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
        sequelize.query(`ALTER SEQUENCE "Users_id_seq" RESTART WITH 1`),
        sequelize.query(`ALTER SEQUENCE "Roles_id_seq" RESTART WITH 1`),
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

  it('[POST] /api/v1/event/create ==>  should not create event tagged to the track', (done) => {
    request.post('/api/v1/event/create')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({trackId: 111, eventTitle: 'Event - 1'})
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

  it('[POST] /api/v1/event/create ==>  should not create event tagged to the track', (done) => {
    request.post('/api/v1/event/create')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({eventTitle: 'Event - 1'})
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
  
  it('[POST] /api/v1/event/create ==>  should create a event tagged to the track', (done) => {
    request.post('/api/v1/event/create')
      .set('Authorization', token)
      .field({trackId: 1, eventTitle: 'Event - 1'})
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

  // it('[POST] /api/v1/event/create ==>  should create a event tagged to the track with image upload', (done) => {
  //   request.post('/api/v1/event/create')
  //     .set('Authorization', token)
  //     .field({trackId: 1, eventTitle: 'Event - 2 with image upload'})
  //     .attach('file', 'test/test.png')
  //     .expect(200)
  //     .end((err, res) => {
  //       if (err) done(err)
  //       assert.exists(res.body)
  //       assert.exists(res.body.success)
  //       assert.exists(res.body.message)
  //       expect(res.body.success).to.be.true
  //       done()
  //     })
  // })

  it('[PUT] /api/v1/event/:id/publish ==>  should publish the event', (done) => {
    request.put('/api/v1/event/1/publish')
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

  it('should have a track referenced', (done) => {
    Models.Event.findOne({where: {id: 1}})
      .then(event => {
        return event.getTrack()
      })
      .then(track => {
        assert.exists(track)
        done()
      })
      .catch(err => done(err))
  })

  it('[POST] /api/v1/event/:eventId/update ==>  should update event attributes', (done) => {
    request.post('/api/v1/event/1/update')
      .set('Authorization', token)
      .field({eventTitle: 'Event - Updated'})
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        assert.exists(res.body.responseObject)
        assert.exists(res.body.responseObject.data)
        assert.exists((res.body.responseObject.data[0].image))
        expect(res.body.responseObject.data[0].title).to.be.equal('Event - Updated')
        expect(res.body.success).to.be.true
        done()
      })
  })

  // it('[POST] /api/v1/event/:eventId/update ==>  should update event attributes with uploaded image', (done) => {
  //   request.post('/api/v1/event/1/update')
  //     .set('Authorization', token)
  //     .field({eventTitle: 'Event - Updated'})
  //     .attach('file', 'test/test1.png')
  //     .expect(200)
  //     .end((err, res) => {
  //       if (err) done(err)
  //       assert.exists(res.body)
  //       assert.exists(res.body.success)
  //       assert.exists(res.body.message)
  //       assert.exists(res.body.responseObject)
  //       assert.exists(res.body.responseObject.data)
  //       assert.exists((res.body.responseObject.data[0].image))
  //       expect(res.body.responseObject.data[0].title).to.be.equal('Event - Updated')
  //       expect(res.body.responseObject.data[0].image).not.to.equal('')
  //       expect(res.body.success).to.be.true
  //       done()
  //     })
  // })

  it('[GET] /api/v1/event/:eventId ==>  should fetch event by ID', (done) => {
    request.get('/api/v1/event/1')
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
        expect(res.body.responseObject.type).to.be.equal('Event')
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[GET] /api/v1/event/:eventId ==>  should fetch event by ID', (done) => {
    request.get('/api/v1/event/1111')
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

  it('[DELETE] /api/v1/event/:eventId/delete ==>  should delete the event', (done) => {
    request.delete('/api/v1/event/1/delete')
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
