import {
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository,
  Encrypter,
  HashComparer,
  Authentication,
  AuthenticationParams
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (auth: AuthenticationParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      auth.email
    )

    if (account) {
      const isValid = await this.hashComparer.compare(
        auth.password,
        account.password
      )

      if (isValid) {
        const token = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          token
        )
        return token
      }
    }
    return null
  }
}