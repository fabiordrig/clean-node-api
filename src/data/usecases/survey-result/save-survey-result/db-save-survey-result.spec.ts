import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
  LoadSurveyResultRepository
} from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'

const makeSurveyResult = (): SurveyResultModel => ({
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

const makeSaveSurveyResult = (): SaveSurveyResultParams => ({
  surveyId: 'anySurveyId',
  accountId: 'anyAccountId',
  answer: 'anyAnswer',
  date: new Date()
})

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> {
      return Promise.resolve()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}
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
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResult()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  )
  return { saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub, sut }
}

type SutTypes = {
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  sut: DbSaveSurveyResult
}

describe('DbSaveSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()

    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    await sut.save(makeSaveSurveyResult())

    expect(saveSpy).toHaveBeenCalledWith(makeSaveSurveyResult())
  })
  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    const loadSPy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    await sut.save(makeSaveSurveyResult())

    expect(loadSPy).toHaveBeenCalledWith(makeSaveSurveyResult().surveyId)
  })
  test('Should return an  SurveyResultModel on success', async () => {
    const { sut } = makeSut()

    const response = await sut.save(makeSaveSurveyResult())

    expect(response).toEqual(makeSurveyResult())
  })
  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.save(makeSaveSurveyResult())
    await expect(promise).rejects.toThrow()
  })
  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.save(makeSaveSurveyResult())
    await expect(promise).rejects.toThrow()
  })
})
