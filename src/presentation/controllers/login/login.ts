import { badRequest, ok, serverError, unauthorized } from '../../helper'
import { Controller, HttpRequest, HttpResponse, Validation, Authentication } from './login-protocols'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (validation: Validation, authentication: Authentication) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }
      const token = await this.authentication.auth(email, password)

      if (!token) {
        return unauthorized()
      }

      return ok({ accessToken: token })
    } catch (err) {
      return serverError(err)
    }
  }
}
