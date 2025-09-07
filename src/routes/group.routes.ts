import express, { Router } from 'express'
import { groupController } from '../controllers/group.controller'
import { asyncHandler } from '../utils/handler.util'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'

const router: Router = express.Router({ mergeParams: true })

// get all groups
router.get('/', rootRoleGuard(['superadmin', 'admin']), asyncHandler(groupController.getAllGroups))

// get single group
router.get(
  '/:id',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.getGroupById)
)

// add group
router.post('/', rootRoleGuard(['superadmin', 'admin']), asyncHandler(groupController.createGroup))

// update group
router.patch(
  '/:id',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.updateGroup)
)

// delete group
router.delete(
  '/:id',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.deleteGroup)
)

// get all users from a group
router.get(
  '/:id/users',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.getGroupUsers)
)

// get all resources form a group
router.get(
  '/:id/resources',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.getGroupResources)
)

// add or remove user(s) from a group
router.patch(
  '/:id/users',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.updateGroupUsers)
)

// add or remove resource(s) from a group
router.patch(
  '/:id/resources',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.updateGroupResources)
)

export { router as groupRoutes }
