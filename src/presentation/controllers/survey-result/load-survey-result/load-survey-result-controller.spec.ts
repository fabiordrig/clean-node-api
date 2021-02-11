import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helper'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { HttpRequest } from '@/presentation/protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'

const makeFakeRequest = (): HttpRequest => ({
  params: { surveyId: 'anySurveyId' }
})

const makeSurveyModel = (): SurveyModel => ({
  id: 'anyId',
  question: 'anyQuestion',
  answers: [
    {
      image: 'anyImage',
      answer: 'anyAnswer'
    },
    {
      answer: 'anyAnswer'
    }
  ],
  date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(makeSurveyModel())
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return { sut, loadSurveyByIdStub }
}
type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    const loadById = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())

    expect(loadById).toHaveBeenCalledWith('anySurveyId')
  })
  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()

    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Should return 500 if loadSurvey throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
