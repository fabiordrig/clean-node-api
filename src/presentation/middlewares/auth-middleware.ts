import {
  HttpRequest,
  LoadAccountByToken,
  accessDenied,
  ok,
  serverError,
  HttpResponse,
  Middleware
} from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (http: HttpRequest): Promise<HttpResponse> {
    const accessToken = http.headers?.['x-access-token']
    try {
      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        )
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return accessDenied()
    } catch (error) {
      return serverError(error)
    }
  }
}
