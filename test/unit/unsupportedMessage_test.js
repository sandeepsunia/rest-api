'use strict'
/* eslint-env node, mocha */
import unsupportedMessage from '../../api/db/unsupportedMessage'
import { assert, expect } from 'chai'

describe('Lib: UnSupported Message', () => {
  it('should have exportable function', (done) => {
    assert.exists(unsupportedMessage)
    done()
  })

  it('should return string with parameter included', done => {
    expect(unsupportedMessage(`JSONP`)).to.be.equal(`Attempted to use 'JSONP' but  POSTGRES doesn't support it`)
    done()
  })
})