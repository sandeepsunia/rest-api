import winston from 'winston'
import { ENV } from '../config/env'
import winstonConfig from '../config/logging'


/*eslint no-process-env: "error"*/


winston.emitErrs = true
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(winstonConfig[ENV])
  ],
  exitOnError: false
})

export default logger