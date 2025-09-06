import express, { Router } from 'express'
import { resourceController } from '../controllers/resource.controller'
import { asyncHandler } from '../utils/handler.util'

const router: Router = express.Router({ mergeParams: true })

// get all resources
router.get('/', asyncHandler(resourceController.getAllResources))

// get single resource
router.get('/:id', asyncHandler(resourceController.getResourceById))

// create resource
router.post('/', asyncHandler(resourceController.createResource))

// update resource
router.patch('/:id', asyncHandler(resourceController.updateResource))

// delete resource
router.delete('/:id', asyncHandler(resourceController.deleteResource))

// get users from resource
router.get('/:id/users', asyncHandler(resourceController.getResourceUsers))

// add or remove user(s) to a resource
router.patch('/:id/users', asyncHandler(resourceController.updateResourceUsers))

export { router as resourceRoutes }
