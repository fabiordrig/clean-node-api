import { SurveyMongoRepository } from '../../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveys } from '../../../../../../domain/usecases/load-survey'
import { DbLoadSurveys } from '../../../../../../data/usecases/load-survey/db-load-survey'

export const makeLoadAddSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
