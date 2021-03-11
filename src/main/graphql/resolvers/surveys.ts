import { adaptResolver } from '@/main/adapter/apollo-server-resolver-adapter'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-survey/load-survey-controller-factory'

export default {
  Query: {
    surveys: async () => adaptResolver(makeLoadSurveysController())
  }
}
