import express, { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { CreateUserDto, DeleteUserDto, UpdateUserDto } from '../dto/user.dto'
import { asyncHandler } from '../utils/handler.util'
import { upload } from '../middlewares/upload.middleware'
import { authTokenGuard } from '../middlewares/auth-token.middleware'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  authTokenGuard,
  validateQueryParams(queryFilterDto),
  asyncHandler(userController.getAllUsers)
)

router.get('/:id', authTokenGuard, asyncHandler(userController.getUserById))

router.post(
  '/',
  authTokenGuard,
  upload.none(),
  validateBody(CreateUserDto),
  asyncHandler(userController.createUser)
)

router.patch(
  '/:id',
  authTokenGuard,
  upload.none(),
  validateBody(UpdateUserDto),
  asyncHandler(userController.updateUser)
)

router.delete(
  '/:id',
  authTokenGuard,
  upload.none(),
  validateBody(DeleteUserDto),
  asyncHandler(userController.deleteUser)
)

export { router as userRoutes }
