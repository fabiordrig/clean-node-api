import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurvey {
  add: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
