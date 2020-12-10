import { InvalidParamError } from '../../errors'
import { CompareFieldValidation } from './compare-field-validation'

const makeSut = (): CompareFieldValidation => {
  return new CompareFieldValidation('field', 'fieldToCompare')
}

describe('CompareFieldValidation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'anyName', fieldToCompare: 'anyValue' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'anyName', fieldToCompare: 'anyName' })
    expect(error).toBeFalsy()
  })
})
