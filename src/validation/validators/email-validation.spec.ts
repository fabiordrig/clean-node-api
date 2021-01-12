import { EmailValidation } from './email-validation'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../../presentation/errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()

  const sut = new EmailValidation('email', emailValidatorStub)
  return { sut, emailValidatorStub }
}

interface SutType {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

describe('EmailValidation', () => {
  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({ email: 'foo@example.com' })

    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'foo@example.com' })

    expect(isValidSpy).toHaveBeenCalledWith('foo@example.com')
  })
})
