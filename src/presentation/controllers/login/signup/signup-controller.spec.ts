import { SignUpController } from './signup-controller'
import {
  EmailInUseError,
  MissingParamError,
  ServerError
} from '@/presentation/errors'
import {
  AccountModel,
  AddAccountParams,
  AddAccount,
  Validation,
  Authentication,
  AuthenticationParams
} from './signup-controller-protocols'
import {
  ok,
  badRequest,
  serverError,
  forbidden
} from '@/presentation/helper/http/http-helper'
import { AuthenticationModel } from '@/domain/models/authentication'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()

      return Promise.resolve(fakeAccount)
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

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (
      authentication: AuthenticationParams
    ): Promise<AuthenticationModel> {
      return { accessToken: 'anyToken', name: 'anyName' }
    }
  }
  return new AuthenticationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'validId',
  name: 'validName',
  email: 'validEmail@mail.com',
  password: 'validPassword'
})

const makeFakeRequest = (): SignUpController.Request => ({
  email: 'anyEmail@mail.com',
  name: 'anyName',
  password: 'anyPassword',
  passwordConfirmation: 'anyPassword'
})

const makeSut = (): SutType => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  )
  return { sut, addAccountStub, validationStub, authenticationStub }
}

interface SutType {
  sut: SignUpController
  validationStub: Validation
  addAccountStub: AddAccount
  authenticationStub: Authentication
}

describe('SignUpController', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const request = {
      email: 'invalidEmail@mail.com',
      name: 'anyName',
      password: 'anyPassword',
      passwordConfirmation: 'anyPassword'
    }
    await sut.handle(request)

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

    expect(httpResponse).toEqual(
      ok({ accessToken: 'anyToken', name: 'anyName' })
    )
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('error'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('error')))
  })
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validate = jest.spyOn(validationStub, 'validate')

    const request = makeFakeRequest()

    await sut.handle(request)

    expect(validate).toHaveBeenCalledWith(request)
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: 'anyEmail@mail.com',
      password: 'anyPassword'
    })
  })
  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
