import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise((resolve) => resolve('anyToken'))
  },
  async verify (): Promise<string> {
    return new Promise((resolve) => resolve('anyValue'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter ', () => {
  describe('sign', () => {
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
    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('anyId')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('anyToken')

      expect(verifySpy).toHaveBeenCalledWith('anyToken', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()

      const accessToken = await sut.decrypt('anyToken')

      expect(accessToken).toBe('anyValue')
    })
    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('anyToken')

      await expect(promise).rejects.toThrow()
    })
  })
})
