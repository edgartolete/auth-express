import express, { Router } from 'express'
import { groupController } from '../controllers/group.controller'
import { asyncHandler } from '../utils/handler.util'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { CreateGroupDto, DeleteGroupDto, UpdateGroupDto } from '../dto/group.dto'

const router: Router = express.Router({ mergeParams: true })

// get all groups
router.get(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(groupController.getAllGroups)
)

// get single group
router.get(
  '/:groupId',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(groupController.getGroupById)
)

// add group
router.post(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(CreateGroupDto),
  asyncHandler(groupController.createGroup)
)

// update group
router.patch(
  '/:groupId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(UpdateGroupDto),
  asyncHandler(groupController.updateGroup)
)

// delete group
router.delete(
  '/:groupId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(DeleteGroupDto),
  asyncHandler(groupController.deleteGroup)
)

// get all users from a group
router.get(
  '/:groupId/users',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.getGroupUsers)
)

// get all resources form a group
// router.get(
//   '/:groupId/resources',
//   rootRoleGuard(['superadmin', 'admin']),
//   asyncHandler(groupController.getGroupResources)
// )
//
// // add or remove user(s) from a group
// router.patch(
//   '/:groupId/users',
//   rootRoleGuard(['superadmin', 'admin']),
//   asyncHandler(groupController.updateGroupUsers)
// )
//
// // add or remove resource(s) from a group
// router.patch(
//   '/:groupId/resources',
//   rootRoleGuard(['superadmin', 'admin']),
//   asyncHandler(groupController.updateGroupResources)
// )

export { router as groupRoutes }
