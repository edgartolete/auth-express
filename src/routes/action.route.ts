import express, { Router } from 'express'
import { actionController } from '../controllers/action.controller'
import { asyncHandler } from '../utils/handler.util'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(actionController.getAllActions)
)

router.get(
  '/:id',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(actionController.getActionById)
)

router.post(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(actionController.createAction)
)

router.patch(
  '/:id',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(actionController.updateAction)
)

router.delete(
  '/:id',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(actionController.deleteAction)
)

export { router as actionRoutes }
