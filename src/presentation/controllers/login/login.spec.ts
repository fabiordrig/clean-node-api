import { LoginController } from './login'
import { badRequest } from '../../helper'
import { MissingParamError } from '../../errors'

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return { sut }
}

interface SutTypes {
  sut: LoginController
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { password: 'anyPassword' }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { email: 'anyMail@mail.com' }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
