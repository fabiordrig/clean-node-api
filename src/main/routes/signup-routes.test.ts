import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('SignUp route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const account = MongoHelper.getCollection('accounts')
    await account.deleteMany({})
  })
  test('Should an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Fabio',
        email: 'fabio@gmail.com',
        password: '1234',
        passwordConfirmation: '1234'
      })
      .expect(200)
  })
})
