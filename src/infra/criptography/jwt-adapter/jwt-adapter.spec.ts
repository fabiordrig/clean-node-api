import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise((resolve) => resolve('anyToken'))
  }
}))

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter('secret')

  return sut
}

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt,'sign')
    await sut.encrypt('anyId')

    expect(signSpy).toHaveBeenCalledWith({ id: 'anyId' }, 'secret')
  })
  test('Should return a token on sign success', async () => {
    const sut = makeSut()

    const accessToken = await sut.encrypt('anyId')

    expect(accessToken).toBe('anyToken')
  })
})
