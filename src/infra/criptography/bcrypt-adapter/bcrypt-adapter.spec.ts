import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise((resolve) => resolve('hash'))
  },
  async compare (): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('anyValue')
    expect(hashSpy).toHaveBeenCalledWith('anyValue', salt)
  })

  test('Should return a valid hash on success', async () => {
    const sut = makeSut()

    const hash = await sut.hash('anyValue')

    expect(hash).toBe('hash')
  })

  test('Should throw if hash throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))

    const promise = sut.hash('anyValue')

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if compare throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))

    const promise = sut.compare('anyValue', 'anyHash')

    await expect(promise).rejects.toThrow()
  })
  test('Should call compare with correct value', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('anyValue', 'anyHash')
    expect(compareSpy).toHaveBeenCalledWith('anyValue', 'anyHash')
  })
  test('Should return true when compare success', async () => {
    const sut = makeSut()

    const hash = await sut.compare('anyValue', 'anyHash')
    expect(hash).toBe(true)
  })
  test('Should return false when compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const hash = await sut.compare('anyValue', 'anyHash')
    expect(hash).toBe(false)
  })
})
