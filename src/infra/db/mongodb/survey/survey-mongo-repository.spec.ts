import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

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

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  test('Should add a survey on success', async () => {
    const sut = makeSut()

    await sut.add({
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

    const survey = await surveyCollection.findOne({ question: 'anyQuestion' })
    expect(survey).toBeTruthy()
  })
})
