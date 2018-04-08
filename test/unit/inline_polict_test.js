'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { assert, expect } from 'chai'
import * as fixture from 'sequelize-fixtures'
import * as _ from 'lodash'

describe('Model: InlinePolicy', () => {
  before((done) => {
    sequelize.sync({force: true})
      .then(() => {
        const fixtureModels = {
          InlinePolicy: Models.InlinePolicy
        }
        fixture.loadFile('test/fixtures/inline_policies.json', fixtureModels, {log: () => {}})
          .then(() => {
            done()
          })
      })
      .catch(err => {
        done(err)
      })
  })

  after(done => {
    Models.InlinePolicy.destroy({
      paranoid: false,
      force: true,
      reset: true,
      where: {}
    })
    .then(() => {
      return sequelize.query(`ALTER SEQUENCE "InlinePolicies_id_seq" RESTART WITH 1`)
    })
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  
  it('should exist', (done) => {
    assert.exists(Models.InlinePolicy)
    done()
  })

  it('should have mandatory attributes', done => {
    Models.InlinePolicy.findAll({})
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

  it('should not allow to create inline policy withoutany data', done => {
    Models.InlinePolicy.create({})
      .catch(err => {
        expect(err.name).to.equal('SequelizeValidationError')
        done()
      })
  })

  it('should allow to create an inline policy with minimal mandatory data', done => {
    let policyData = {
      resource: 'Role',
      action: 'update'
    }
    Models.InlinePolicy.create(policyData)
      .then(policy => {
        assert.exists(policy)
        expect(policy.resource).to.equal('Role')
        expect(policy.action).to.equal('update')
        expect(policy.upn).to.equal('role::update')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})