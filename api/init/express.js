/*eslint-env node*/
import express from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'
import path from 'path'
import flash from 'express-flash'
import gzip from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import { ENV, PORT } from '../../config/env'
import logger from './../../utils/logger'
import MustBe from 'mustbe'
import mustbeConfig from '../../config/mustbe_config'

/*eslint no-process-env: "error"*/

export default (app) => {
  app.set('port', (PORT || 3001))
  app.use(cors())
  if (ENV === 'production') {
    app.use(gzip())
    app.use(helmet())
  }

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(express.static(path.join(process.cwd(), 'public')))
  
  MustBe.configure(mustbeConfig)

  logger.info('--------------------------')
  logger.info('===> 😊  Starting Server . . .')
  logger.info(`===>  Environment: ${ENV}`)
  logger.info(`===>  Listening on port: ${app.get('port')}`)
  logger.info('--------------------------')

  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())
}
