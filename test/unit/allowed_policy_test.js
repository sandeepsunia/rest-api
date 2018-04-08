'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import * as fixture from 'sequelize-fixtures'
import * as _ from 'lodash'


describe('Model: AllowedPolicy', () => {
  before((done) => {
    sequelize.sync({force: true})
      .then(() => {
        const fixtureModels = {
          AllowedPolicy: Models.AllowedPolicy
        }
        fixture.loadFile('test/fixtures/allowed_policies.json', fixtureModels, {log: () => {}})
          .then(() => {
            done()
          })
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    Models.AllowedPolicy.destroy({
      paranoid: false,
      force: true,
      reset: true,
      where: {}
    })
    .then(() => {
      return sequelize.query(`ALTER SEQUENCE "AllowedPolicies_id_seq" RESTART WITH 1`)
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  
  it('should exist', (done) => {
    assert.exists(Models.AllowedPolicy)
    done()
  })

  it('should have mandatory attributes', done => {
    Models.AllowedPolicy.findAll({})
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

  it('should not allow to create allowed policy withoutany data', done => {
    Models.AllowedPolicy.create({})
      .catch(err => {
        expect(err.name).to.equal('SequelizeValidationError')
        done()
      })
  })

  it('should allow to create an allowed policy with minimal mandatory data', done => {
    let policyData = {
      resource: 'User',
      action: 'read'
    }
    Models.AllowedPolicy.create(policyData)
      .then(policy => {
        assert.exists(policy)
        expect(policy.resource).to.equal('User')
        expect(policy.action).to.equal('read')
        expect(policy.upn).to.equal('user::read')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
