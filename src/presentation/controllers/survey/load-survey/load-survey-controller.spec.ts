import { LoadSurveysController } from './load-survey-controller'
import { LoadSurveys, SurveyModel } from './load-survey-protocols'
import MockDate from 'mockdate'
import { noContent, ok, serverError } from '@/presentation/helper'

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'anyId',
      question: 'anyQuestion',
      answers: [
        {
          image: 'anyImage',
          answer: 'anyAnswer'
        }
      ],
      date: new Date()
    },
    {
      id: 'otherId',
      question: 'otherQuestion',
      answers: [
        {
          image: 'otherImage',
          answer: 'otherAnswer'
        }
      ],
      date: new Date()
    }
  ]
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveysStub {
    async load (): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys())
    }
  }
  return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)

  return { sut, loadSurveysStub }
}

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: 'validId'
})

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysStub } = makeSut()

    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('validId')
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })
  test('Should return 204 if LoadSurveys return empty ', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
  test('Should return 500 if loadSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest
      .spyOn(loadSurveysStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
