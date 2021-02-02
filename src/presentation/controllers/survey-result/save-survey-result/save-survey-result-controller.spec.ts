import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SurveyResultModel
} from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'

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

const makeSurveyResult = (): SurveyResultModel => ({
  id: 'validSurveyId',
  surveyId: 'validSurveyId',
  accountId: 'validAccountId',
  answer: 'validAnswer',
  date: new Date()
})

const makeFakeRequest = (): HttpRequest => ({
  params: { surveyId: 'anySurveyId' },
  body: {
    answer: 'anyAnswer'
  },
  accountId: 'anyAccountId'
})

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(makeSurveyResult())
    }
  }
  return new SaveSurveyResultStub()
}

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
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub
  )

  return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
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
  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      params: { surveyId: 'anySurveyId' },
      body: {
        answer: 'wrongAnswer'
      },
      accountId: 'anyAccountId'
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()

    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'anySurveyId',
      accountId: 'anyAccountId',
      date: new Date(),
      answer: 'anyAnswer'
    })
  })
  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest
      .spyOn(saveSurveyResultStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeSurveyResult()))
  })
})
