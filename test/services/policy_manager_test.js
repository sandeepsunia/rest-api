'use strict'
/* eslint-env node, mocha */
import { Models, sequelize } from '../../api/db/sequelize/models'
import { getPolicies } from '../../services/policy_manager'
import { assert, expect } from 'chai'
import * as fixture from 'sequelize-fixtures'

describe('Service: PolicyManager', () => {
  let user = null
  before((done) => {
    sequelize.sync()
      .then(() => {
        const fixtureModels = {
          User: Models.User,
          Role: Models.Role,
          UserRole: Models.UserRole,
          AllowedPolicy: Models.AllowedPolicy,
          DeniedPolicy: Models.DeniedPolicy,
          InlinePolicy: Models.InlinePolicy
        }
        fixture.loadFiles([
          'test/fixtures/users.json',
          'test/fixtures/roles.json',
          'test/fixtures/user_roles.json',
          'test/fixtures/allowed_policies.json',
          'test/fixtures/denied_policies.json',
          'test/fixtures/inline_policies.json'
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

  beforeEach((done) => {
    Models.User.findOne({
      where: {
        id: 1
      }
    })
    .then(queryUser => {
      user = queryUser
      done()
    })
    .catch(err => {
      done(err)
    })
  })
  
  it('should have exportable function #getPolicies', (done) => {
    assert.exists(getPolicies)
    done()
  })

  it('shold return [allowed|denied|inline] policies', (done) => {
    getPolicies(user.id).then(policies => {
      assert.exists(policies.allowed)
      assert.exists(policies.denied)
      assert.exists(policies.inline)
      done()
    })
    .catch(err => {
      done(err)
    })
  })

})