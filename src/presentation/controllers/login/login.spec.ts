import { LoginController } from './login'
import { badRequest } from '../../helper'
import { MissingParamError } from '../../errors'

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: { password: 'anyPassword' }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
