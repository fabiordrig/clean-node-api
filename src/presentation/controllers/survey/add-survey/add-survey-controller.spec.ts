import { HttpRequest, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'anyQuestion',
    answers: [
      {
        image: 'anyImage',
        answer: 'anyAnswer'
      }
    ]
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()

  const sut = new AddSurveyController(validationStub)
  return { sut, validationStub }
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
