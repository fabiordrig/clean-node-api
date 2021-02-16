import { Collection, ObjectId } from 'mongodb'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AccountModel } from '@/domain/models/account'

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

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  return MongoHelper.map(res.ops[0])
}

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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
      const account = await makeAccount()

      const res = await surveyCollection.insertMany([
        makeFakeAddSurveys(),
        makeFakeAddSurveys()
      ])

      const survey = res.ops[0]

      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey._id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveys = await sut.loadAll(account.id)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('anyQuestion')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe('anyQuestion')
      expect(surveys[1].didAnswer).toBe(false)
    })
    test('Should loadAll a empty list', async () => {
      const sut = makeSut()
      const account = await makeAccount()
      const surveys = await sut.loadAll(account.id)

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
