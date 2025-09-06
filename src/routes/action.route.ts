import express, { Router } from 'express'
import { actionController } from '../controllers/action.controller'
import { asyncHandler } from '../utils/handler.util'

const router: Router = express.Router({ mergeParams: true })

router.get('/', asyncHandler(actionController.getAllActions))

router.get('/:id', asyncHandler(actionController.getActionById))

router.post('/', asyncHandler(actionController.createAction))

router.patch('/:id', asyncHandler(actionController.updateAction))

router.delete('/:id', asyncHandler(actionController.deleteAction))

export { router as actionRoutes }
