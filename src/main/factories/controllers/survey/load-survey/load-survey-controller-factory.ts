import { Controller } from '@/presentation/protocols'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-survey/load-survey-controller'
import { makeLogControllerDecorator } from '@/main/factories/decorators/login-controller-decorator-factory'
import { makeLoadAddSurveys } from '@/main/factories/controllers/usecases/survey/load-survey/db-load-survey-factory'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeLoadAddSurveys())
  return makeLogControllerDecorator(controller)
}
