'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import * as fixture from 'sequelize-fixtures'
import * as _ from 'lodash'

describe('Model: Role', () => {
  before((done) => {
    sequelize.sync({force: true})
      .then(() => {
        const fixtureModels = {
          Role: Models.Role
        }
        fixture.loadFile('test/fixtures/roles.json', fixtureModels, {log: () => {}})
          .then(() => {
            done()
          })
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    Models.Role.destroy({
      paranoid: false,
      force: true,
      reset: true,
      where: {}
    })
    .then(() => {
      return sequelize.query(`ALTER SEQUENCE "Roles_id_seq" RESTART WITH 1`)
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  
  it('should exist', (done) => {
    assert.exists(Models.Role)
    done()
  })

  it('should have mandatory attributes', done => {
    Models.Role.findAll({})
      .then(roles => {
        let role = _.first(roles)
        assert.exists(role.name)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should not allow to create role withoutany data', done => {
    Models.Role.create({})
      .catch(err => {
        expect(err.name).to.equal('SequelizeValidationError')
        done()
      })
  })

  it('should allow to create a role with minimal mandatory data', done => {
    let roleData = {
      name: 'Admin'
    }
    Models.Role.create(roleData)
      .then(role => {
        assert.exists(role)
        expect(role.name).to.equal('Admin')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})