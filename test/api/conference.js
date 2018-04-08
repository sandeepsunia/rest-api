'use strict'
/* eslint-env node, mocha */
process.env.NODE_ENV = 'test'

import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import Promise from 'bluebird'
import * as fixture from 'sequelize-fixtures'
import { agent  } from 'supertest'
import app from '../../api'


describe('Conference API', () => {
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

  it('[POST] /api/v1/conference/create ==>  should create a conference', (done) => {
    request.post('/api/v1/conference/create')
      .set('Authorization', token)
      .field({conferenceName: 'Conference'})
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

  // it('[POST] /api/v1/conference/create ==>  should create a conference with image upload', (done) => {
  //   request.post('/api/v1/conference/create')
  //     .set('Authorization', token)
  //     .field({conferenceName: 'Conference image upload'})
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

  it('[POST] /api/v1/conference/create ==>  should not create a conference without required parameters', (done) => {
    request.post('/api/v1/conference/create')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({})
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        expect(res.body.success).to.be.false
        done()
      })
  })

  it('[POST] /api/v1/conference/:conferenceId/update ==>  should update the conference title', (done) => {
    request.post('/api/v1/conference/1/update')
      .set('Authorization', token)
      .field({conferenceName: 'Changed Conf Title'})
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        assert.exists(res.body.responseObject)
        assert.exists(res.body.responseObject.data)
        assert.exists(res.body.responseObject.data[0].image)
        expect(res.body.responseObject.type).to.be.equal('Conference')
        expect(res.body.responseObject.data[0].title).to.be.equal('Changed Conf Title')
        expect(res.body.success).to.be.true
        done()
      })
  })

  // it('[POST] /api/v1/conference/:conferenceId/update ==>  should update the conference title with image upload', (done) => {
  //   request.post('/api/v1/conference/1/update')
  //     .set('Authorization', token)
  //     .field({conferenceName: 'Changed Conf Title'})
  //     .attach('file', 'test/test1.png')
  //     .expect(200)
  //     .end((err, res) => {
  //       if (err) done(err)
  //       assert.exists(res.body)
  //       assert.exists(res.body.success)
  //       assert.exists(res.body.message)
  //       assert.exists(res.body.responseObject)
  //       assert.exists(res.body.responseObject.data)
  //       assert.exists(res.body.responseObject.data[0].image)
  //       expect(res.body.responseObject.type).to.be.equal('Conference')
  //       expect(res.body.responseObject.data[0].title).to.be.equal('Changed Conf Title')
  //       expect(res.body.responseObject.data[0].image).not.to.equal('')
  //       expect(res.body.success).to.be.true
  //       done()
  //     })
  // })

  it('[GET] /api/v1/conference/:conferenceId ==>  should return success with the conference data', (done) => {
    request.get('/api/v1/conference/1')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        assert.exists(res.body.responseObject)
        assert.exists(res.body.responseObject.type)
        assert.exists(res.body.responseObject.count)
        assert.exists(res.body.responseObject.data)
        assert.isArray(res.body.responseObject.data)
        expect(res.body.responseObject.type).to.be.equal('Conference')
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[GET] /api/v1/conference/:conferenceId/events ==>  should give 400 Bad Request as empty query params sent', (done) => {
    request.get('/api/v1/conference/1/events?tag&trackId')
      .set('Accept', 'application/json')
      .set('Authorization', token)
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

  it('[GET] /api/v1/conference/:conferenceId/events ==>  should fetch events with matching title', (done) => {
    request.get('/api/v1/conference/1/events?tag=event')
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
        assert.isArray(res.body.responseObject.data)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[GET] /api/v1/conference/:conferenceId/events ==>  should fetch events with provided trackId', (done) => {
    request.get('/api/v1/conference/1/events?trackId=1')
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
        assert.isArray(res.body.responseObject.data)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[GET] /api/v1/conference/:conferenceId/events ==>  should fetch events with matching title and trackId', (done) => {
    request.get('/api/v1/conference/1/events?tag=event&trackId=1')
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
        assert.isArray(res.body.responseObject.data)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[GET] /api/v1/conference/:conferenceId/drafts ==>  should fetch draft events', (done) => {
    request.get('/api/v1/conference/1/drafts')
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
        assert.isArray(res.body.responseObject.data)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[DELETE] /api/v1/conference/:conferenceId/delete ==>  should not create a conference without required parameters', (done) => {
    request.delete('/api/v1/conference/1/delete')
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
