import express, { Router } from 'express'
import { appController } from '../controllers/app.controller'
import { appCodeGuard } from '../middlewares/appcode-guard.middlware'
import { asyncHandler } from '../utils/handler.util'

const router: Router = express.Router({ mergeParams: true })

router.get('/', asyncHandler(appController.getAllApps))

router.get('/:appCode', appCodeGuard, asyncHandler(appController.getAppById))

router.post('/', asyncHandler(appController.createApp))

router.patch('/:appCode', appCodeGuard, asyncHandler(appController.updateApp))

router.delete('/:appCode', appCodeGuard, asyncHandler(appController.deleteApp))

router.post('/login', asyncHandler(appController.login))

router.post('/logout', asyncHandler(appController.logout))

export { router as appRoutes }
