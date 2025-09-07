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
import { superUserGuard } from '../middlewares/sp-guard.middleware'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  superUserGuard,
  rootRoleGuard(['superadmin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(appController.getAllApps)
)

router.get(
  '/:appCode',
  superUserGuard,
  rootRoleGuard(['superadmin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(appController.getAppById)
)

router.post(
  '/',
  superUserGuard,
  rootRoleGuard(['superadmin']),
  validateBody(CreateAppDto),
  asyncHandler(appController.createApp)
)

router.patch(
  '/:appCode',
  superUserGuard,
  rootRoleGuard(['superadmin']),
  validateBody(UpdateAppDto),
  asyncHandler(appController.updateApp)
)

router.delete(
  '/:appCode',
  superUserGuard,
  rootRoleGuard(['superadmin']),
  validateBody(DeleteAppDto),
  asyncHandler(appController.deleteApp)
)

router.post('/login', upload.none(), validateBody(LoginAuthDto), asyncHandler(appController.login))

router.post('/logout', upload.none(), asyncHandler(appController.logout))

export { router as appRoutes }
