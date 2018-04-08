'use strict'
/* eslint-env node, mocha */
process.env.NODE_ENV = 'test'

import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import Promise from 'bluebird'
import * as fixture from 'sequelize-fixtures'
import { agent  } from 'supertest'
import app from '../../api'


describe('Base API', () => {
  const request = agent(app)
  let authToken = null
  before((done) => {
    sequelize.sync()
      .then(() => {
        const fixtureModels = {
          User: Models.User,
          Role: Models.Role,
          UserRole: Models.UserRole
        }
        fixture.loadFiles([
          'test/fixtures/users.json',
          'test/fixtures/roles.json',
          'test/fixtures/user_roles.json'
        ], fixtureModels, {log: () => {}})  
        .then(() => {
          return Models.UserRole.findAll({})
        })
        .then(() => {
          done()
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
      })
    ])
    .then(() => {
      return Promise.all([
        sequelize.query(`ALTER SEQUENCE "Users_id_seq" RESTART WITH 1`),
        sequelize.query(`ALTER SEQUENCE "Roles_id_seq" RESTART WITH 1`)
      ])
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })

  it('[GET] / ==>  should return 200 OK', (done) => {
    request.get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[POST] / ==>  should return 404', (done) => {
    request.post('/')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        done()
      })
  })
  
  it('[GET] /some/unknown/api/for/404 ==>  should return 404', (done) => {
    request.get('/some/unknown/api/for/404')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        done()
      })
  })

  it('[POST] /some/unknown/api/for/404 ==>  should return 404', (done) => {
    request.post('/some/unknown/api/for/404')
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        done()
      })
  })

})