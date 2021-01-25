/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../adapter/express-route-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-controller-factory'
import { adaptMiddleware } from '../adapter/express-middleware-adapter'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
