'use strict'

import nodemailer from 'nodemailer'
import { baseURL } from '../config/app'
import { Models } from '../api/db/sequelize/models'
import logger from '../utils/logger'
import { EmailTemplate } from 'email-templates'
import path from 'path'



import { 
  smtpAdmin,
  smtpHost,
  smtpPort,
  smtpUsername,
  smtpPassword
} from '../config/secrets'
const User = Models.User
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: smtpUsername,
    pass: smtpPassword
  }
})


const passwordReset =  (req, res) => {
  let email = req.body.email
  let templateDir = path.join(__dirname, 'templates', 'reset_password')
  logger.debug(`template dir ${templateDir}`)
  let resetPasswordTemplate = new EmailTemplate(templateDir)
  
  const resetPasswordToken = `randomToken`

  let context = {
    email: email,
    resetLink: `${baseURL}/resetPassword?token=${resetPasswordToken}`
  }
  
  User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ success: false, message: `User not found` })
      }
      
      resetPasswordTemplate.render(context, (err, result) => {
        const { html, text, subject } = result
        logger.info(`HTML email - ${html}`)
        transporter.sendMail({
          from: smtpAdmin,
          to: email,
          subject: subject,
          text: text,
          html: html
        })
        .then(info => {
          return res.status(200).json({ success: true, message: `Message ${info.messageId} sent: ${info.response}` })
        })
      })
    })
    .catch((err) => {
      return res.status(200).json({ success: false, message: `Something went wrong 2 ${JSON.stringify(err)}` })
    })
}

export {
  passwordReset
}
