import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@/presentation/helper'
import {
  Controller,
  HttpResponse,
  Validation,
  Authentication
} from './login-controller-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    const { email, password } = request

    try {
      const error = this.validation.validate(request)

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

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
