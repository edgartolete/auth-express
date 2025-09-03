import express, { Router } from 'express'
import { profileController } from '../controllers/profile.controller'
import { upload } from '../middlewares/upload.middleware'
import { validateBody } from '../middlewares/validator.middleware'
import { UpdateProfileDto } from '../dto/profile.dto'
import { asyncHandler } from '../utils/handler.util'
import { authTokenGuard } from '../middlewares/auth-token.middleware'

const router: Router = express.Router()

router.patch(
  '/:id',
  authTokenGuard(['self']),
  upload.single('file'),
  validateBody(UpdateProfileDto),
  asyncHandler(profileController.updateProfile)
)

export { router as profileRoutes }
