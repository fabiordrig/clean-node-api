import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,
  async connect (url: string) {
    this.url = url
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect () {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.url)
    }
    return this.client.db().collection(name)
  },
  map (data: any): any {
    const { _id, ...accountWithoutId } = data
    return Object.assign({}, accountWithoutId, { id: _id })
  },
  mapCollection (data: any[]): any[] {
    return data.map(MongoHelper.map)
  }
}
