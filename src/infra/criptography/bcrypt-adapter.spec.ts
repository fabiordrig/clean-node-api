import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise((resolve) => resolve('hash'))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('anyValue')
    expect(hashSpy).toHaveBeenCalledWith('anyValue', salt)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()

    const hash = await sut.hash('anyValue')

    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))

    const promise = sut.hash('anyValue')

    await expect(promise).rejects.toThrow()
  })
})
