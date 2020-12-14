import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

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
})
