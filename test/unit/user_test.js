'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import * as fixture from 'sequelize-fixtures'
import * as _ from 'lodash'

describe('Model: User', () => {
  before((done) => {
    sequelize.sync({force: true})
      .then(() => {
        const fixtureModels = {
          User: Models.User
        }
        fixture.loadFile('test/fixtures/users.json', fixtureModels, {log: () => {}})
          .then(() => {
            done()
          })
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    Models.User.destroy({
      paranoid: false,
      force: true,
      reset: true,
      where: {}
    })
    .then(() => {
      return sequelize.query(`ALTER SEQUENCE "Users_id_seq" RESTART WITH 1`)
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  
  it('should exist', (done) => {
    assert.exists(Models.User)
    done()
  })

  it('should have mandatory attributes', done => {
    Models.User.findAll({})
      .then(users => {
        let user = _.first(users)
        assert.exists(user.name)
        assert.exists(user.email)
        assert.exists(user.password)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should not allow to create user withoutany data', done => {
    Models.User.create({})
      .catch(err => {
        expect(err.name).to.equal('SequelizeValidationError')
        done()
      })
  })

  it('should allow to create a user with minmal mandatory data', done => {
    let userData = {
      name: 'Test User',
      email: 'test_user@test.com',
      password: 'everything_nice'
    }
    Models.User.create(userData)
      .then(user => {
        assert.exists(user)
        expect(user.name).to.equal('Test User')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})