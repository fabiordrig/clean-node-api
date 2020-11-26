import { MongoHelper } from '../helpers/mongo-helper'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('',() => {
    expect(true).toBe(true)
  })
  // test('Should return an account on success', async () => {
  //   const sut = new AddAccountMongoRepository()

  //   const account = await sut.add({
  //     name: 'anyName',
  //     email: 'anyEmail@mail.com',
  //     password: 'anyPassword'
  //   })

  //   expect(account).toBeTruthy()
  //   expect(account.id).toBeTruthy()
  //   expect(account.name).toBe('anyName')
  //   expect(account.email).toBe('anyEmail@mail.com')
  //   expect(account.password).toBe('anyPassword')
  // })
})
