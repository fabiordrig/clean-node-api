import { SignUpController } from '@/presentation/controllers/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '@/main/factories/controllers/usecases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/controllers/usecases/account/add-account/add-account--factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/login-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(controller)
}
