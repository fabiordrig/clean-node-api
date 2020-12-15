import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection
describe('Account Mongo Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: 'anyName',
      email: 'anyEmail@mail.com',
      password: 'anyPassword'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('anyName')
    expect(account.email).toBe('anyEmail@mail.com')
    expect(account.password).toBe('anyPassword')
  })
  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'anyName',
      email: 'anyEmail@mail.com',
      password: 'anyPassword'
    })
    const account = await sut.loadByEmail('anyEmail@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('anyName')
    expect(account.email).toBe('anyEmail@mail.com')
    expect(account.password).toBe('anyPassword')
  })
  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()

    const account = await sut.loadByEmail('anyEmail@mail.com')

    expect(account).toBeFalsy()
  })
  test('Should update the access token on UpdateAccessToken success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'anyName',
      email: 'anyEmail@mail.com',
      password: 'anyPassword'
    })

    const fakeAccount = result.ops[0]
    expect(fakeAccount.accessToken).toBeFalsy()

    await sut.updateAccessToken(fakeAccount._id, 'anyToken')
    const account = await accountCollection.findOne({ _id: fakeAccount._id })

    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('anyToken')
  })
})