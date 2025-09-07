import express, { Router } from 'express'
import { appController } from '../controllers/app.controller'
import { appCodeGuard } from '../middlewares/appcode-guard.middlware'
import { asyncHandler } from '../utils/handler.util'
import { authTokenGuard } from '../middlewares/auth-token.middleware'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  asyncHandler(appController.getAllApps)
)

router.get(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  appCodeGuard,
  asyncHandler(appController.getAppById)
)

router.post(
  '/',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  asyncHandler(appController.createApp)
)

router.patch(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  appCodeGuard,
  asyncHandler(appController.updateApp)
)

router.delete(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  appCodeGuard,
  asyncHandler(appController.deleteApp)
)

router.post('/login', asyncHandler(appController.login))

router.post('/logout', asyncHandler(appController.logout))

export { router as appRoutes }
