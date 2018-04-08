import express from 'express'
import { isDebug } from '../config/app'
import { connect } from './db'
import initExpress from './init/express'
import initRoutes from './init/routes'
import initPassport from './init/passport'
import swaggerUI from 'swagger-ui-express'
import swaggerDoc from '../swagger.json'
import MustBe from 'mustbe'

const app = express()
const showExplorer = true
/**
 * Connecting to DB
 */

if (isDebug) {
  // Add Dev debugging code like logger etc.
}

connect()

initPassport()

/**
 * Bootstrap application settings
 */

initExpress(app)

initRoutes(app, MustBe)

app.get('/', (req, res) => {
  res.send({success: true, message: `'Relax the front end will come but the API server is up.'`})
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc, showExplorer))


app.listen(app.get('port'))

export default app
