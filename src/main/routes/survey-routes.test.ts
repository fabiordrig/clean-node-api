import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import env from '../config/env'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveyCollection: Collection
let accountCollection: Collection

describe('Login route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })
  describe('POST /surveys', () => {
    test('Should return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/surveys')

        .send({
          question: 'anyQuestion',
          answers: [
            {
              answer: 'anyAnswer',
              image: 'http://image-name.com'
            }
          ]
        })
        .expect(403)
    })
    test('Should return 204 on add survey with valid token', async () => {
      const result = await accountCollection.insertOne({
        name: 'Fabio',
        email: 'fabio@gmail.com',
        password: '1234',
        role: 'admin'
      })

      const id = result.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)

      await accountCollection.updateOne(
        { _id: id },
        {
          $set: {
            accessToken
          }
        }
      )

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'anyQuestion',
          answers: [
            {
              answer: 'anyAnswer',
              image: 'http://image-name.com'
            }
          ]
        })
        .expect(204)
    })
  })
})
