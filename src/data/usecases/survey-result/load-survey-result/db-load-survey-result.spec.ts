import {
  LoadSurveyResultRepository,
  SurveyResultModel,
  SurveyModel,
  LoadSurveyByIdRepository
} from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import MockDate from 'mockdate'

const mockSurveyResult = (): SurveyResultModel => ({
  surveyId: 'anyId',
  question: 'anyQuestion',
  answers: [
    {
      answer: 'anyAnswer',
      count: 0,
      percent: 0,
      image: 'anyImage'
    }
  ],
  date: new Date()
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'anyId',
  question: 'anyQuestion',
  answers: [
    {
      image: 'anyImage',
      answer: 'anyAnswer'
    }
  ],
  date: new Date()
})

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

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
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  )
  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub }
}

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
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

  test('Should call LoadSurveyByIdRepository if returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub
    } = makeSut()

    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null))

    await sut.load('anySurveyId')

    expect(loadSpy).toHaveBeenCalledWith('anySurveyId')
  })
  test('Should return a SurveyResultModel with all answers count 0 if returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null))

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
