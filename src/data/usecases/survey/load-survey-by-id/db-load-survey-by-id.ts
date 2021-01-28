import {
  SurveyModel,
  LoadSurveyById,
  LoadSurveyByIdRepository
} from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveysRepository: LoadSurveyByIdRepository
  ) {}

  async loadById (id: string): Promise<SurveyModel> {
    return this.loadSurveysRepository.loadById(id)
  }
}
