import express, { Router } from 'express'
import { actionController } from '../controllers/action.controller'

const router: Router = express.Router({ mergeParams: true })

router.get('/', actionController.getAllActions)

router.get('/:id', actionController.getActionById)

router.post('/', actionController.createAction)

router.patch('/:id', actionController.updateAction)

router.delete('/:id', actionController.deleteAction)

export { router as actionRoutes }
