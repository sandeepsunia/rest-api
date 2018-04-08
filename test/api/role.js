'use strict'
/* eslint-env node, mocha */
process.env.NODE_ENV = 'test'

import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import Promise from 'bluebird'
import * as fixture from 'sequelize-fixtures'
import { agent  } from 'supertest'
import app from '../../api'


describe('Role API', () => {
  const request = agent(app)
  let token = null
  before((done) => {
    sequelize.sync()
      .then(() => {
        const fixtureModels = {
          User: Models.User,
          Role: Models.Role,
          UserRole: Models.UserRole,
          AllowedPolicy: Models.AllowedPolicy
        }
        fixture.loadFiles([
          'test/fixtures/users.json',
          'test/fixtures/roles.json',
          'test/fixtures/user_roles.json',
          'test/fixtures/allowed_policies.json'
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

  it('[POST] /api/v1/role/create should create role with valid data', (done) => {
    request.post('/api/v1/role/create')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({roleName: 'TestRole'})
      .expect(201)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[POST] /api/v1/role/policy/add ==>  should return 201 with valid data', (done) => {
    request.post('/api/v1/role/policy/add')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({roleId: 2, policyId: 1, policyType: 'Allowed'})
      .expect(201)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[POST] /api/v1/role/policy/add ==>  should return 201 with valid data', (done) => {
    request.post('/api/v1/role/policy/add')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({roleId: 2, policyUPN: 'user:create', policyType: 'Allowed'})
      .expect(201)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.message)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it('[POST] /api/v1/role/policy/add ==>  should return 400 with invalid data', (done) => {
    request.post('/api/v1/role/policy/add')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({roleId: 2, policyUPN: 'user:delete'})
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

  it('[POST] /api/v1/role/policy/add ==>  should return 404 with unknown role', (done) => {
    request.post('/api/v1/role/policy/add')
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send({roleId: 999, policyUPN: 'user:delete', policyType: 'Allowed'})
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
})