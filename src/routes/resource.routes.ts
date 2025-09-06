import express, { Router } from 'express'
import { resourceController } from '../controllers/resource.controller'

const router: Router = express.Router({ mergeParams: true })

// get all resources
router.get('/', resourceController.getAllResources)

// get single resource
router.get('/:id', resourceController.getResourceById)

// create resource
router.post('/', resourceController.createResource)

// update resource
router.patch('/:id', resourceController.updateResource)

// delete resource
router.delete('/:id', resourceController.deleteResource)

// get users from resource
router.get('/:id/users', resourceController.getResourceUsers)

// get roles from resource
router.get('/:id/roles', resourceController.getResourceRoles)

// add or remove user(s) to a resource
router.patch('/:id/users', resourceController.updateResourceUsers)

// add or remove role(s) to a resource
router.patch('/:id/roles', resourceController.updateResourceRoles)

export { router as resourceRoutes }
