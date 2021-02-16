import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@/presentation/helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  Authentication
} from './login-controller-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }
      const auth = await this.authentication.auth({ email, password })

      if (!auth) {
        return unauthorized()
      }

      return ok(auth)
    } catch (err) {
      return serverError(err)
    }
  }
}
