import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/login/login-controller'
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/login-controller-decorator-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeLoginValidation(),
    makeDbAuthentication()
  )
  return makeLogControllerDecorator(controller)
}
