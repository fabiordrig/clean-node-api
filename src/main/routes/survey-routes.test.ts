import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
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

  return accessToken
}

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
      const accessToken = await makeAccessToken()

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
  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without token', async () => {
      await request(app).get('/api/surveys').expect(403)
    })
    test('Should return 200 on load surveys with token', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertMany([
        {
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
        }
      ])

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
    test('Should return 204 on load surveys with token', async () => {
      const accessToken = await makeAccessToken()

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
