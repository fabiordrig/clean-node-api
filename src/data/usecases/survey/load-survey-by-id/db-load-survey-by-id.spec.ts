import {
  SurveyModel,
  LoadSurveyByIdRepository
} from './db-load-survey-by-id-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'

import MockDate from 'mockdate'

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

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveysRepositoryStub)

  return { sut, loadSurveysRepositoryStub }
}

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveysRepositoryStub: LoadSurveyByIdRepository
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadById')
    await sut.loadById('anyId')

    expect(loadSpy).toHaveBeenCalled()
  })
  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.loadById('anyId')

    expect(surveys).toEqual(makeFakeSurvey())
  })
  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.loadById('anyId')
    await expect(promise).rejects.toThrow()
  })
})
