import express, { Router } from 'express'
import { resourceController } from '../controllers/resource.controller'
import { asyncHandler } from '../utils/handler.util'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { CreateResourceDto, DeleteResourceDto, UpdateResourceDto } from '../dto/resource.dto'

const router: Router = express.Router({ mergeParams: true })

// get all resources
router.get(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(resourceController.getAllResources)
)

// get single resource
router.get(
  '/:resourceId',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(resourceController.getResourceById)
)

// create resource
router.post(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(CreateResourceDto),
  asyncHandler(resourceController.createResource)
)

// update resource
router.patch(
  '/:resourceId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(UpdateResourceDto),
  asyncHandler(resourceController.updateResource)
)

// delete resource
router.delete(
  '/:resourceId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(DeleteResourceDto),
  asyncHandler(resourceController.deleteResource)
)

// get users from resource
router.get(
  '/:resourceId/users',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(resourceController.getResourceUsers)
)

// // add or remove user(s) to a resource
// router.patch(
//   '/:resourceId/users',
//   rootRoleGuard(['superadmin', 'admin']),
//   asyncHandler(resourceController.updateResourceUsers)
// )

export { router as resourceRoutes }
