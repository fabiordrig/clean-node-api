import {
  SaveSurveyResultParams,
  SurveyResultModel,
  SaveSurveyResultRepository
} from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'

const makeSurveyResult = (): SurveyResultModel => ({
  id: 'anyId',
  surveyId: 'anySurveyId',
  accountId: 'anyAccountId',
  answer: 'anyAnswer',
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
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(makeSurveyResult()))
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return { saveSurveyResultRepositoryStub, sut }
}

type SutTypes = {
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
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
})
