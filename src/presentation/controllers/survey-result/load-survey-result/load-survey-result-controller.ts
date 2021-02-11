import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      await this.loadSurveyById.loadById(surveyId)
      return Promise.resolve(null)
    } catch (error) {
      return serverError(error)
    }
  }
}
