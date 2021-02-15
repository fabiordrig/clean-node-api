import { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Fabio',
    email: 'fabio@gmail.com',
    password: '1234'
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

  return accessToken
}

describe('Survey Result route', () => {
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
  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/anyId/results')
        .send({
          answer: 'anyAnswer'
        })
        .expect(403)
    })
    test('Should return 200 on save survey result with valid token', async () => {
      const accessToken = await makeAccessToken()

      const res = await surveyCollection.insertOne({
        question: 'anyQuestion',
        answers: [
          {
            answer: 'anyAnswer',
            image: 'anyImage'
          }
        ]
      })

      const id: string = res.ops[0]._id

      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'anyAnswer'
        })
        .expect(200)
    })
  })
  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without access token', async () => {
      await request(app)
        .get('/api/surveys/anyId/results')
        .send({
          answer: 'anyAnswer'
        })
        .expect(403)
    })
  })
})
