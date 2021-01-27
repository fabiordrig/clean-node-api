import { Controller } from '../../../../../presentation/protocols'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-survey/load-survey-controller'
import { makeLogControllerDecorator } from '../../../decorators/login-controller-decorator-factory'
import { makeLoadAddSurveys } from '../../usecases/survey/load-survey/db-load-survey-factory'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeLoadAddSurveys())
  return makeLogControllerDecorator(controller)
}
