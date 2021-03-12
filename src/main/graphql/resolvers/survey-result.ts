import { adaptResolver } from '@/main/adapter/apollo-server-resolver-adapter'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'

export default {
  Query: {
    surveyResult: async (_: any, args: any) =>
      adaptResolver(makeLoadSurveyResultController(), args)
  },
  Mutation: {
    saveSurveyResult: async (_: any, args: any) =>
      adaptResolver(makeSaveSurveyResultController(), args)
  }
}
