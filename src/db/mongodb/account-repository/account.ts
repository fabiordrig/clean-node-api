import { AddAccountRepository, AccountModel, AddAccountModel } from './account-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)
    const { _id, ...accountWithoutId } = result.ops[0]

    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
