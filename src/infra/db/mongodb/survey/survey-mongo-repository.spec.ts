import { Collection } from 'mongodb'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeFakeAddSurveys = (): AddSurveyParams => ({
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

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()

      await sut.add(makeFakeAddSurveys())

      const survey = await surveyCollection.findOne({ question: 'anyQuestion' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll', () => {
    test('Should loadAll a survey on success', async () => {
      const sut = makeSut()

      await surveyCollection.insertMany([
        makeFakeAddSurveys(),
        makeFakeAddSurveys()
      ])

      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('anyQuestion')
    })
    test('Should loadAll a empty list', async () => {
      const sut = makeSut()

      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(0)
    })
  })
  describe('loadById', () => {
    test('Should load by id a survey on success', async () => {
      const res = await surveyCollection.insertOne(makeFakeAddSurveys())

      const id = res.ops[0]._id

      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
