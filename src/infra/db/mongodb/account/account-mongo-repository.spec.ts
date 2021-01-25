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
  describe('add', () => {
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
  })
  describe('loadByEmail', () => {
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
  })
  describe('loadByToken', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'anyName',
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        accessToken: 'anyToken'
      })
      const account = await sut.loadByToken('anyToken')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('anyName')
      expect(account.email).toBe('anyEmail@mail.com')
      expect(account.password).toBe('anyPassword')
    })
    test('Should return an account on loadByToken  with admin role', async () => {
      const role = 'admin'
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'anyName',
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        accessToken: 'anyToken',
        role
      })
      const account = await sut.loadByToken('anyToken', role)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('anyName')
      expect(account.email).toBe('anyEmail@mail.com')
      expect(account.password).toBe('anyPassword')
    })

    test('Should return an account on loadByToken  if user is admin', async () => {
      const role = 'admin'
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'anyName',
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        accessToken: 'anyToken',
        role
      })
      const account = await sut.loadByToken('anyToken')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('anyName')
      expect(account.email).toBe('anyEmail@mail.com')
      expect(account.password).toBe('anyPassword')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'anyName',
        email: 'anyEmail@mail.com',
        password: 'anyPassword',
        accessToken: 'anyToken'
      })
      const account = await sut.loadByToken('anyToken', 'admin')

      expect(account).toBeFalsy()
    })
    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken('anyToken')

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken', () => {
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
})
