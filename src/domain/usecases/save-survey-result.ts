import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>
export interface SaveSurvey {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
