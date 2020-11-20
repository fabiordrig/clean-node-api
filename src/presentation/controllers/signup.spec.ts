import { SignUpController } from './signup'

describe('SignUpController', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'anyName@example.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPasswordConfirmation'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
