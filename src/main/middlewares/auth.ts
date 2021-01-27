import { adaptMiddleware } from '@/main/adapter/express-middleware-adapter'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-controller-factory'

export const auth = adaptMiddleware(makeAuthMiddleware())
