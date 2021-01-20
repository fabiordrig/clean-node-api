import { accessDenied } from '../helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
  async handle (http: HttpRequest): Promise<HttpResponse> {
    return accessDenied()
  }
}
