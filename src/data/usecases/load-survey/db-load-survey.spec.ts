import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { DbLoadSurveys } from './db-load-survey'
import MockDate from 'mockdate'

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

const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return { sut, loadSurveysRepositoryStub }
}

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()

    expect(loadSpy).toHaveBeenCalled()
  })
  test('Should a list of survey on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()

    expect(surveys).toEqual(makeFakeSurveys())
  })
  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
