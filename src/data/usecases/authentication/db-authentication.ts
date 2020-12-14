import { UpdateAccessTokenRepository, LoadAccountByEmailRepository,TokenGenerator,HashComparer, Authentication, AuthenticationModel } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator, updateAccessTokenRepository: UpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (auth: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(auth.email)

    if (account) {
      const isValid = await this.hashComparer.compare(auth.password, account.password)

      if (isValid) {
        const token = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, token)
        return token
      }
    }
    return null
  }
}
