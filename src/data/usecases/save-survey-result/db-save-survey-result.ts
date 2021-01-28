import {
  SurveyResultModel,
  SaveSurveyResultRepository,
  SaveSurvey,
  SaveSurveyResultModel
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurvey {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return this.saveSurveyResultRepository.save(data)
  }
}
