import { SignUpController } from './signup'
import { MissingParamError, ServerError } from '../../errors'
import { AccountModel, AddAccountModel, AddAccount, HttpRequest, Validation } from './signup-protocols'
import { ok,badRequest,serverError } from '../../helper/http-helper'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()

      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'validId',
  name: 'validName',
  email: 'validEmail@mail.com',
  password: 'validPassword'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'anyEmail@mail.com',
    name: 'anyName',
    password: 'anyPassword',
    passwordConfirmation: 'anyPassword'
  }
})

const makeSut = (): SutType => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return { sut, addAccountStub, validationStub }
}

interface SutType {
  sut: SignUpController
  validationStub: Validation
  addAccountStub: AddAccount
}

describe('SignUpController', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        email: 'invalidEmail@mail.com',
        name: 'anyName',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword'
      }
    }
    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      email: 'invalidEmail@mail.com',
      name: 'anyName',
      password: 'anyPassword'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('error'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('error')))
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validate = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validate).toHaveBeenCalledWith(httpRequest.body)
  })
})
