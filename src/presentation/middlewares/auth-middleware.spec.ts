import {
  HttpRequest,
  AccountModel,
  LoadAccountByToken,
  accessDenied,
  ok,
  serverError,
  AuthMiddleware
} from './auth-middleware-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'validId',
  name: 'validName',
  email: 'validEmail@mail.com',
  password: 'validPassword'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'anyToken'
  }
})

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()

  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return { sut, loadAccountByTokenStub }
}
interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(accessDenied())
  })
  test('Should call LoadAccountByToken with correct token', async () => {
    const role = 'anyRole'
    const { sut, loadAccountByTokenStub } = makeSut(role)

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledWith('anyToken', role)
  })
  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(accessDenied())
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ accountId: 'validId' }))
  })
  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
