import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { accessDenied, ok } from '../helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle (http: HttpRequest): Promise<HttpResponse> {
    const accessToken = http.headers?.['x-access-token']

    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) {
        return ok({ accountId: account.id })
      }
    }
    return accessDenied()
  }
}
