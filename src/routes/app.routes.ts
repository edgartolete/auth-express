import express, { Router } from 'express'
import { appController } from '../controllers/app.controller'
import { asyncHandler } from '../utils/handler.util'
import { authTokenGuard } from '../middlewares/auth-token.middleware'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { CreateAppDto, DeleteAppDto, UpdateAppDto } from '../dto/app.dto'
import { upload } from '../middlewares/upload.middleware'
import {
  ForgotRequestAuthDto,
  ForgotSubmitAuthDto,
  LoginAuthDto,
  ResetPasswordAuthDto
} from '../dto/auth.dto'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(appController.getAllApps)
)

router.get(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(appController.getAppById)
)

router.post(
  '/',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  validateBody(CreateAppDto),
  asyncHandler(appController.createApp)
)

router.patch(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  validateBody(UpdateAppDto),
  asyncHandler(appController.updateApp)
)

router.delete(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  validateBody(DeleteAppDto),
  asyncHandler(appController.deleteApp)
)

router.post('/login', upload.none(), validateBody(LoginAuthDto), asyncHandler(appController.login))

router.post('/logout', upload.none(), asyncHandler(appController.logout))

router.post(
  '/forgot-request',
  upload.none(),
  validateBody(ForgotRequestAuthDto),
  asyncHandler(appController.forgotRequest)
)

router.post(
  '/forgot-submit',
  upload.none(),
  validateBody(ForgotSubmitAuthDto),
  asyncHandler(appController.forgotSubmit)
)

router.post(
  '/reset-password',
  upload.none(),
  authTokenGuard,
  validateBody(ResetPasswordAuthDto),
  asyncHandler(appController.resetPassword)
)

export { router as appRoutes }
