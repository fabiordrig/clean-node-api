import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return new MissingParamError('field')
      }
    }
    const validation = new ValidationStub()
    const sut = new ValidationComposite([validation])
    const error = sut.validate({ field: 'anyName' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
