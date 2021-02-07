import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'

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
  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    const loadSurveySpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )
    await sut.load('anySurveyId')
    expect(loadSurveySpy).toHaveBeenCalledWith('anySurveyId')
  })
})
