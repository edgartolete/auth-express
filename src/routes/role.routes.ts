import express, { Router } from 'express'
import { roleController } from '../controllers/role.controller'
import { asyncHandler } from '../utils/handler.util'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { CreateRoleDto, DeleteRoleDto, ReorderRoleDto, UpdateRoleDto } from '../dto/role.dto'
import { upload } from '../middlewares/upload.middleware'
import { authTokenGuard } from '../middlewares/auth-token.middleware'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  authTokenGuard(['admin']),
  upload.none(),
  validateQueryParams(queryFilterDto),
  asyncHandler(roleController.getAllRoles)
)
router.get('/:id', authTokenGuard(['admin']), asyncHandler(roleController.getRoleById))
router.post(
  '/',
  authTokenGuard(['admin']),
  upload.none(),
  validateBody(CreateRoleDto),
  asyncHandler(roleController.createRole)
)
router.patch(
  '/reorder',
  authTokenGuard(['admin']),
  validateBody(ReorderRoleDto),
  asyncHandler(roleController.reorderRoles)
)
router.patch(
  '/:id',
  authTokenGuard(['admin']),
  upload.none(),
  validateBody(UpdateRoleDto),
  asyncHandler(roleController.updateRole)
)
router.delete(
  '/:id',
  authTokenGuard(['admin']),
  upload.none(),
  validateBody(DeleteRoleDto),
  asyncHandler(roleController.deleteRole)
)

export { router as roleRoutes }
