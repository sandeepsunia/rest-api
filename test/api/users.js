'use strict'
/* eslint-env node, mocha */
process.env.NODE_ENV = 'test'

import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import Promise from 'bluebird'
import * as fixture from 'sequelize-fixtures'
import { agent  } from 'supertest'
import app from '../../api'


describe('User API', () => {
  const request = agent(app)
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

  it(`[POST] /api/v1/user/register ==>  should return 201 with valid data`, (done) => {
    request.post('/api/v1/user/register')
      .set('Accept', 'application/json')
      .send({email: 'sandeep@test.com', password: 'test123'})
      .expect(201)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it(`[POST] /api/v1/user/register ==>  should not return success with no data`, (done) => {
    request.post('/api/v1/user/register')
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        expect(res.body.success).to.be.false
        done()
      })
  })

  it(`[POST] /api/v1/user/register ==>  should not return success with invalid data`, (done) => {
    request.post('/api/v1/user/register')
      .set('Accept', 'application/json')
      .send({username: 'sandeep@test.com', password: 'test123'})
      .expect(400) // Invalid creds
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        expect(res.body.success).to.be.false
        done()
      })
  })

  it(`[POST] /api/v1/user/login ==>  should respond with success and provide token`, (done) => {
    request.post('/api/v1/user/login')
      .set('Accept', 'application/json')
      .send({email: 'angela_bond@test.com', password: 'angela_bond'})
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        assert.exists(res.body.responseObject)
        assert.exists(res.body.responseObject.data)
        expect(res.body.responseObject.data).to.be.an('array')
        assert.exists(res.body.responseObject.count)
        assert.exists(res.body.responseObject.data[0].token)
        expect(res.body.success).to.be.true
        done()
      })
  })

  it(`[POST] /api/v1/user/login ==>  should UnAuthorize user with invalid credential`, (done) => {
    request.post('/api/v1/user/login')
      .set('Accept', 'application/json')
      .send({email: 'angela_bond@test.com', password: 'jfju32jwf23rfijn23rr'})
      .expect(401)
      .end((err, res) => {
        if (err) done(err)
        assert.exists(res.body)
        assert.exists(res.body.success)
        expect(res.body.success).to.be.false
        done()
      })
  })

  describe('Authenticated APIs', () => {
    let token = null
    before((done) => {
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

    it(`[GET] /api/v1/user/update ==> should update user data`, (done) => {
      request.post(`/api/v1/user/update`)
        .set('Authorization', token)
        .field({id: 1, name: 'sandeep sunia', location: 'stonybrook', affiliation: 'student'})
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            assert.exists(res.body.message)
            assert.exists(res.body.responseObject)
            assert.exists(res.body.responseObject.data)
            assert.exists(res.body.responseObject.count)
            assert.exists(res.body.responseObject.data[0].picture)
            expect(res.body.responseObject.type).to.be.equal('User')
            expect(res.body.responseObject.data[0].name).to.be.equal('sandeep sunia')
            expect(res.body.responseObject.data[0].location).to.be.equal('stonybrook')
            expect(res.body.responseObject.data[0].affiliation).to.be.equal('student')
            expect(res.body.success).to.be.true
            done()
          }
        })
    })

    it(`[GET] /api/v1/user/:id/update ==> should update user data`, (done) => {
      request.post(`/api/v1/user/1/update`)
        .set('Authorization', token)
        .field({id: 1, name: 'sandeep', location: 'stony', affiliation: 'student'})
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            assert.exists(res.body.message)
            assert.exists(res.body.responseObject)
            assert.exists(res.body.responseObject.data)
            assert.exists(res.body.responseObject.count)
            assert.exists(res.body.responseObject.data[0].picture)
            expect(res.body.responseObject.type).to.be.equal('User')
            expect(res.body.responseObject.data[0].name).to.be.equal('sandeep')
            expect(res.body.responseObject.data[0].location).to.be.equal('stony')
            expect(res.body.responseObject.data[0].affiliation).to.be.equal('student')
            expect(res.body.success).to.be.true
            done()
          }
        })
    })

    // it(`[GET] /api/v1/user/update ==> should update user data with image upload update`, (done) => {
    //   request.post(`/api/v1/user/update`)
    //     .set('Authorization', token)
    //     .field({id: 1, name: 'sandeep sunia', location: 'stonybrook', affiliation: 'student'})
    //     .attach('file', 'test/test.png')
    //     .expect(200)
    //     .end((err, res) => {
    //       if (err) {
    //         done(err)
    //       } else {
    //         assert.exists(res.body)
    //         assert.exists(res.body.success)
    //         assert.exists(res.body.message)
    //         assert.exists(res.body.responseObject)
    //         assert.exists(res.body.responseObject.data)
    //         assert.exists(res.body.responseObject.count)
    //         assert.exists(res.body.responseObject.data[0].picture)
    //         expect(res.body.responseObject.type).to.be.equal('User')
    //         expect(res.body.responseObject.data[0].name).to.be.equal('sandeep sunia')
    //         expect(res.body.responseObject.data[0].location).to.be.equal('stonybrook')
    //         expect(res.body.responseObject.data[0].affiliation).to.be.equal('student')
    //         expect(res.body.responseObject.data[0].picture).not.to.equal('')
    //         expect(res.body.success).to.be.true
    //         done()
    //       }
    //     })
    // })

    it(`[GET] /api/v1/user/:userId ==> should fetch user by ID`, (done) => {
      request.get(`/api/v1/user/1`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            assert.exists(res.body.responseObject)
            assert.exists(res.body.responseObject.type)
            assert.exists(res.body.responseObject.count)
            assert.exists(res.body.responseObject.data)
            expect(res.body.success).to.be.true
            done()
          }
        })
    })

    it(`[GET] /api/v1/user/email/:email ==> should fetch by email`, (done) => {
      request.get(`/api/v1/user/email/angela_bond@test.com`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            assert.exists(res.body.responseObject)
            assert.exists(res.body.responseObject.type)
            assert.exists(res.body.responseObject.count)
            assert.exists(res.body.responseObject.data)
            expect(res.body.success).to.be.true
            done()
          }
        })
    })

    it(`[GET] /api/v1/users ==> should fetch all users`, (done) => {
      request.get(`/api/v1/users`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            assert.exists(res.body.responseObject)
            assert.exists(res.body.responseObject.type)
            assert.exists(res.body.responseObject.count)
            assert.exists(res.body.responseObject.data)
            expect(res.body.success).to.be.true
            done()
          }
        })
    })
    
    it(`[GET] /api/v1/users ==> should fetch matched users with name or affiliation `, (done) => {
      request.get(`/api/v1/users`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .query({ tag: 'developer'})
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            assert.exists(res.body.responseObject)
            assert.exists(res.body.responseObject.type)
            assert.exists(res.body.responseObject.count)
            assert.exists(res.body.responseObject.data)
            expect(res.body.success).to.be.true
            done()
          }
        })
    })

    it(`[GET] /api/v1/users ==> should not succeed if search param tag is blank `, (done) => {
      request.get(`/api/v1/users?tag=`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            expect(res.body.success).to.be.false
            done()
          }
        })
    })

    it(`[GET] /api/v1/users ==> should fetch users who are speaker `, (done) => {
      request.get(`/api/v1/users`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .query({ speaker: true})
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            assert.exists(res.body.responseObject)
            assert.exists(res.body.responseObject.type)
            assert.exists(res.body.responseObject.count)
            assert.exists(res.body.responseObject.data)
            expect(res.body.success).to.be.true
            done()
          }
        })
    })

    it(`[GET] /api/v1/users ==> should not succeed if speaker filter param is blank `, (done) => {
      request.get(`/api/v1/users?speaker=`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            expect(res.body.success).to.be.false
            done()
          }
        })
    })

    it(`[POST] /users/v1/:userId/addRole/:roleId ==> should add existing role to existing user`, (done) => {
      request.post(`/api/v1/users/1/addRole/2`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(201)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            expect(res.body.success).to.be.true
            done()
          }
        })
    })

    it(`[POST] /users/v1/:userId/addRole/:roleId ==>  should not succeed if role dsn't exist`, (done) => {
      request.post(`/api/v1/users/1/addRole/4`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            expect(res.body.success).to.be.false
            done()
          }
        })
    })

    it(`[POST] /users/v1/:userId/addRole/:roleId ==>  should not succeed if role dsn't exist`, (done) => {
      request.post(`/api/v1/users/1/addRole/101`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            expect(res.body.success).to.be.false
            done()
          }
        })
    })

    it(`[POST] /api/v1/users/:userId/addRole/:roleId ==>  should not succeed if user dsn't exist`, (done) => {
      request.post(`/api/v1/users/14/addRole/1`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            expect(res.body.success).to.be.false
            done()
          }
        })
    })

    it(`[POST] /api/v1/users/v1 ==>  should not succeed if user dsn't exist`, (done) => {
      request.post(`/api/v1/user/logout`)
        .set(`Accept`, `application/json`)
        .set(`Authorization`, token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            assert.exists(res.body)
            assert.exists(res.body.success)
            expect(res.body.success).to.be.true
            done()
          }
        })
    })
  })
})
