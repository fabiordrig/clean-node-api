import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { accessDenied } from '../helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle (http: HttpRequest): Promise<HttpResponse> {
    const accessToken = http.headers?.['x-access-token']

    if (accessToken) {
      await this.loadAccountByToken.load(accessToken)
    }
    return accessDenied()
  }
}
