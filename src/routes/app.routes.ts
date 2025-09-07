import express, { Router } from 'express'
import { appController } from '../controllers/app.controller'
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
  asyncHandler(appController.updateApp)
)

router.delete(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  asyncHandler(appController.deleteApp)
)

router.post('/login', asyncHandler(appController.login))

router.post('/logout', asyncHandler(appController.logout))

router.post('/forgot-request', asyncHandler(appController.forgotRequest))

router.post('/forgot-submit', asyncHandler(appController.forgotSubmit))

router.post('/reset-password', authTokenGuard, asyncHandler(appController.resetPassword))

export { router as appRoutes }
