import { HttpResponse, HttpRequest } from '.'

export interface Controller {
  handle (httpRequest: HttpRequest): HttpResponse
}
