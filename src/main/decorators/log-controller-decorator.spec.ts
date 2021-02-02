import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'
import { serverError, ok } from '@/presentation/helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { AccountModel } from '@/domain/models/account'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(makeFakeAccount()))
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'anyStack'
  return serverError(fakeError)
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

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should LogErrorRepository with correct error if controller return a ServerError', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
      return mockServerError()
    })
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    await sut.handle(makeFakeRequest())

    expect(logSpy).toHaveBeenCalledWith('anyStack')
  })
})
