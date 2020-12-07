import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    try {
      if (!email) {
        return new Promise((resolve) => resolve(badRequest(new MissingParamError('email'))))
      }
      if (!password) {
        return new Promise((resolve) => resolve(badRequest(new MissingParamError('password'))))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return new Promise((resolve) => resolve(badRequest(new InvalidParamError('email'))))
      }
    } catch (err) {
      return serverError(err)
    }
  }
}
