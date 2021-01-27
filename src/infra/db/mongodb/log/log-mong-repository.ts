import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const error = await MongoHelper.getCollection('errors')
    await error.insertOne({
      stack,
      date: new Date()
    })
  }
}
