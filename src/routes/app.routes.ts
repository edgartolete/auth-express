import express, { Router } from 'express'
import { appController } from '../controllers/app.controller'
import { appCodeGuard } from '../middlewares/appcode-guard.middlware'

const router: Router = express.Router({ mergeParams: true })

router.get('/', appController.getAllApps)

router.get('/:appCode', appCodeGuard, appController.getAppById)

router.post('/', appController.createApp)

router.patch('/:appCode', appCodeGuard, appController.updateApp)

router.delete('/:appCode', appCodeGuard, appController.deleteApp)

router.post('/login', appController.login)

router.post('/logout', appController.logout)

export { router as appRoutes }
