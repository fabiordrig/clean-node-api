import { badRequest, noContent, serverError } from '../../../helper/'
import {
  AddSurvey,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      const { question, answers } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers
      })

      if (error) {
        return badRequest(error)
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
