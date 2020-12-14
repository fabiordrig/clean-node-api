import { DbAuthentication } from './db-authentication'
import { UpdateAccessTokenRepository, LoadAccountByEmailRepository,TokenGenerator,HashComparer, AccountModel, AuthenticationModel } from './db-authentication-protocols'

const makeLoadAccountRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()
      return new Promise((resolve) => resolve(account))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
  }
  return new HashComparerStub()
}
const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return new Promise((resolve) => resolve('anyToken'))
    }
  }
  return new TokenGeneratorStub()
}
const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'anyId',
  name: 'anyName',
  email: 'anyEmail@mail.com',
  password: 'hashedPassword'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'test@example.com',
  password: 'anyPassword'
})

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

describe('DbAuthentication use case', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('test@example.com')
  })
  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve,reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe(null)
  })
  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledWith('anyPassword', 'hashedPassword')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve,reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)))

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe(null)
  })

  test('Should call TokenGenerator with correct values', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.auth(makeFakeAuthentication())

    expect(generateSpy).toHaveBeenCalledWith('anyId')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    jest.spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve,reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should call TokenGenerator with correct values', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe('anyToken')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith('anyId','anyToken')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    jest.spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolve,reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
