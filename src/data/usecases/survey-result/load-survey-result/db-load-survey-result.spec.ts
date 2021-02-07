import {
  LoadSurveyResultRepository,
  SurveyResultModel
} from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import MockDate from 'mockdate'

const mockSurveyResult = (): SurveyResultModel => ({
  surveyId: 'anySurveyId',
  question: 'anyQuestion',
  answers: [
    {
      answer: 'anyAnswer',
      count: 1,
      percent: 1,
      image: 'anyImage'
    }
  ],
  date: new Date()
})

const mockLoadSurveyResult = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResult())
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResult()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return { sut, loadSurveyResultRepositoryStub }
}

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    const loadSurveySpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )
    await sut.load('anySurveyId')
    expect(loadSurveySpy).toHaveBeenCalledWith('anySurveyId')
  })

  test('Should return a SurveyResultModel on success', async () => {
    const { sut } = makeSut()

    const response = await sut.load('anySurveyId')

    expect(response).toEqual(mockSurveyResult())
  })
  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.load('anySurveyId')
    await expect(promise).rejects.toThrow()
  })
})
