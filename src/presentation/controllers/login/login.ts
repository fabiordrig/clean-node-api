import { MissingParamError } from '../../errors'
import { badRequest } from '../../helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body: { email, password } } = httpRequest

    if (!email) {
      return new Promise((resolve) => resolve(badRequest(new MissingParamError('email'))))
    }
    if (!password) {
      return new Promise((resolve) => resolve(badRequest(new MissingParamError('password'))))
    }

    this.emailValidator.isValid(email)
  }
}
