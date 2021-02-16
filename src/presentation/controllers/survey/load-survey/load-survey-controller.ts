import { noContent, ok, serverError } from '@/presentation/helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys
} from './load-survey-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest
      const surveys = await this.loadSurveys.load(accountId)

      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
