/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRoute } from '../adapter/express-route-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-controller-factory'
import { adaptMiddleware } from '../adapter/express-middleware-adapter'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-survey/load-survey-controller-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
