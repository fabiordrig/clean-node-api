import { noContent, ok, serverError } from '@/presentation/helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys
} from './load-survey-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (_: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()

      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
