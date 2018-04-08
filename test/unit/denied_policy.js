'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import * as fixture from 'sequelize-fixtures'
import * as _ from 'lodash'

describe('Model: DeniedPolicy', () => {
  before((done) => {
    sequelize.sync({force: true})
      .then(() => {
        const fixtureModels = {
          DeniedPolicy: Models.DeniedPolicy
        }
        fixture.loadFile('test/fixtures/denied_policies.json', fixtureModels, {log: () => {}})
          .then(() => {
            done()
          })
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    Models.DeniedPolicy.destroy({
      paranoid: false,
      force: true,
      reset: true,
      where: {}
    })
    .then(() => {
      return sequelize.query(`ALTER SEQUENCE "DeniedPolicies_id_seq" RESTART WITH 1`)
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  
  it('should exist', (done) => {
    assert.exists(Models.DeniedPolicy)
    done()
  })

  it('should have mandatory attributes', done => {
    Models.DeniedPolicy.findAll({})
      .then(policies => {
        let policy = _.first(policies)
        assert.exists(policy.resource)
        assert.exists(policy.action)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('should not allow to create denied policy withoutany data', done => {
    Models.DeniedPolicy.create({})
      .catch(err => {
        expect(err.name).to.equal('SequelizeValidationError')
        done()
      })
  })

  it('should allow to create an denied policy with minimal mandatory data', done => {
    let policyData = {
      resource: 'user',
      action: 'read'
    }
    Models.DeniedPolicy.create(policyData)
      .then(policy => {
        assert.exists(policy)
        expect(policy.resource).to.equal('user')
        expect(policy.action).to.equal('read')
        expect(policy.upn).to.equal('user::read')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})