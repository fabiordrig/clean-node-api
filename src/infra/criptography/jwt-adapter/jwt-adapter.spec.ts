import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise((resolve) => resolve('anyToken'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('anyId')

    expect(signSpy).toHaveBeenCalledWith({ id: 'anyId' }, 'secret')
  })
  test('Should return a token on sign success', async () => {
    const sut = makeSut()

    const accessToken = await sut.encrypt('anyId')

    expect(accessToken).toBe('anyToken')
  })
  test('Shoul throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('anyId')

    await expect(promise).rejects.toThrow()
  })
})
