import { HttpResponse, HttpRequest } from '.'

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
