import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'

let accountCollection: Collection
describe('Login route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('POST /signup', () => {
    test('Should return 200 on signup success', async () => {
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
  describe('POST /login', () => {
    test('Should return 200 on login success', async () => {
      const password = await hash('1234', 12)
      await accountCollection.insertOne({
        name: 'Fabio',
        email: 'fabio@gmail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'fabio@gmail.com',
          password: '1234'
        })
        .expect(200)
    })
    test('Should return 401 on login fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'fabio@gmail.com',
          password: '1234'
        })
        .expect(401)
    })
  })
})
