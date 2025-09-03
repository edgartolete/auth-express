import express, { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { CreateUserDto, DeleteUserDto, ReorderUserDto, UpdateUserDto } from '../dto/user.dto'
import { asyncHandler } from '../utils/handler.util'
import { upload } from '../middlewares/upload.middleware'
import { authTokenGuard } from '../middlewares/auth-token.middleware'

const router: Router = express.Router()

router.get(
  '/',
  authTokenGuard(['admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(userController.getAllUsers)
)

router.get('/:id', authTokenGuard(['admin', 'self']), asyncHandler(userController.getUserById))

router.post(
  '/',
  authTokenGuard(['admin']),
  upload.none(),
  validateBody(CreateUserDto),
  asyncHandler(userController.createUser)
)

router.patch(
  '/reorder',
  authTokenGuard(['admin']),
  validateBody(ReorderUserDto),
  asyncHandler(userController.reorderUsers)
)

router.patch(
  '/:id',
  authTokenGuard(['admin', 'self']),
  upload.none(),
  validateBody(UpdateUserDto),
  asyncHandler(userController.updateUser)
)

router.delete(
  '/:id',
  authTokenGuard(['admin', 'self']),
  upload.none(),
  validateBody(DeleteUserDto),
  asyncHandler(userController.deleteUser)
)

export { router as userRoutes }
