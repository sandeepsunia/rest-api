'use strict'

import passport from 'passport'
import { Router } from 'express'
import { controllers, passport as passportConfig } from '../db'
import { passwordReset } from '../../services/mailer'
import { minioUpload } from '../../utils/minio.js'

const usersController = controllers && controllers.user
const resourceController = controllers && controllers.resource
const policyController = controllers && controllers.policy
const rolesController = controllers && controllers.role
const conferenceController = controllers && controllers.conference
const trackController = controllers && controllers.track
const eventController = controllers && controllers.event
import Multer from 'multer'
var upload = Multer({ dest: 'data/' })

const router = Router()

export default (app, MustBe) => {
  const mustbe = MustBe.routeHelpers()
  /**
   * User API
   */
  if (passportConfig && passportConfig.token) {
    router.post('/user/register', usersController.register)
    
    router.post('/user/login', usersController.authenticate)

    router.post('/reset-password', passwordReset)
    
    router.post('/user/logout', 
      passport.authenticate('jwt', {session: false}),
      usersController.expireToken)

    router.post(`/user/uploadCsv`,
      passport.authenticate('jwt', {session: false}),
      upload.single('file'), function (req, res, next) {
        next()
      },
      usersController.uploadCsv)

    router.post(`/user/update`,
      passport.authenticate('jwt', {session: false}),
      Multer({storage: Multer.memoryStorage()}).any(), 
      minioUpload,
      usersController.updateUser)

    router.post(`/user/:id/update`,
      passport.authenticate('jwt', {session: false}),
      Multer({storage: Multer.memoryStorage()}).any(),
      minioUpload,
      usersController.updateUserById)


    router.delete(`/user/:id/delete`,
      passport.authenticate('jwt', {session: false}),
      usersController.deleteById)  

    router.get(`/users`,
      passport.authenticate('jwt', {session: false}),
      usersController.fetchUsers)

    router.get(`/user/:userId`,
      passport.authenticate('jwt', {session: false}),
      usersController.fetchById)

    router.get(`/user/email/:email`,
      passport.authenticate('jwt', {session: false}),
      usersController.fetchByEmail)

    router.post(`/users/:userId/addRole/:roleId`,
      passport.authenticate('jwt', {session: false}),
      mustbe.authorized('admin'),
      usersController.addRoleToUser)
    
    router.get(`/users/me`,
      passport.authenticate('jwt', {session: false}),
      usersController.getProfile)
    
  }
  
  /**
   * Resource API
   */
  router.get('/resource/all',
    passport.authenticate('jwt', {session: false}),
    resourceController.getResources)

  /**
   * Policy API
   */
  router.post('/policy/create',
    passport.authenticate('jwt', {session: false}),
    policyController.addResourcePolicy)
  
  /**
   * Roles API
   */
  router.post('/role/policy/add',
    passport.authenticate('jwt', {session: false}),
    rolesController.addPolicy)

  router.post('/role/create',
    passport.authenticate('jwt', {session: false}),
    rolesController.create)

  /**
   * Conference API
   */

  router.post('/conference/create',
    passport.authenticate('jwt', {session: false}),
    Multer({storage: Multer.memoryStorage()}).any(), 
    minioUpload,
    conferenceController.create)
  
  router.post('/conference/:conferenceId/update',
    passport.authenticate('jwt', {session: false}),
    Multer({storage: Multer.memoryStorage()}).any(),
    minioUpload,
    conferenceController.update)
  
  router.get('/conference/:conferenceId',
    passport.authenticate('jwt', {session: false}),
    conferenceController.fetchById)
  
  router.delete('/conference/:conferenceId/delete',
    passport.authenticate('jwt', {session: false}),
    conferenceController.deleteById)
  
  router.get(`/conference/:conferenceId/events`,
    passport.authenticate('jwt', {session: false}),
    conferenceController.getAllEvents)

  router.get(`/conference/:conferenceId/drafts`,
    passport.authenticate('jwt', {session: false}),
    conferenceController.getAllDrafts)
  
  router.get(`/conference/:conferenceId/tracks`,
    passport.authenticate('jwt', {session: false}),
    conferenceController.getTracks)

  /**
   * Track API
   */
  
  /**
   * Track Create needs conferenceId
   */
  router.post('/track/create',
    passport.authenticate('jwt', {session: false}),
    trackController.createConferenceTrack)

  router.post('/track/:trackId/update',
    passport.authenticate('jwt', {session: false}),
    trackController.updateTrack)

  router.post('/track/:trackId',
    passport.authenticate('jwt', {session: false}),
    trackController.fetch)

  router.delete('/track/:trackId/delete',
    passport.authenticate('jwt', {session: false}),
    trackController.deleteById)
  
  /**
   * Event API
   */

  router.post('/event/create',
    passport.authenticate('jwt', {session: false}),
    Multer({storage: Multer.memoryStorage()}).any(),
    minioUpload,
    eventController.createTrackEvent)

  router.post('/event/:eventId/update',
    passport.authenticate('jwt', {session: false}),
    Multer({storage: Multer.memoryStorage()}).any(),
    minioUpload,
    eventController.updateEvent)

  router.get('/event/:eventId',
    passport.authenticate('jwt', {session: false}),
    eventController.fetch)

  
  router.put('/event/:eventId/publish',
    passport.authenticate('jwt', {session: false}),
    eventController.publish)

  router.delete('/event/:eventId/delete',
    passport.authenticate('jwt', {session: false}),
    eventController.deleteById)

  router.get(`/config`,
    passport.authenticate('jwt', {session: false}),
    conferenceController.getActiveConferenceLatest)

  router.post(`/events/:eventId/join-working-group`,
    passport.authenticate('jwt', {session: false}),
    eventController.joinWorkingGroup)

  app.use('/api/v1', router)
}
