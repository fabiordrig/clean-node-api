import { LoginController } from './login'
import { badRequest } from '../../helper'
import { MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return { sut , emailValidatorStub }
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
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

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: { email: 'anyMail@mail.com', password: 'anyPassword' }
    }

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('anyMail@mail.com')
  })
})
