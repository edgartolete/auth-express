import express, { Router } from 'express'
import { groupController } from '../controllers/group.controller'
import { asyncHandler } from '../utils/handler.util'

const router: Router = express.Router({ mergeParams: true })

// get all groups
router.get('/', asyncHandler(groupController.getAllGroups))

// get single group
router.get('/:id', asyncHandler(groupController.getGroupById))

// add group
router.post('/', asyncHandler(groupController.createGroup))

// update group
router.patch('/:id', asyncHandler(groupController.updateGroup))

// delete group
router.delete('/:id', asyncHandler(groupController.deleteGroup))

// get all users from a group
router.get('/:id/users', asyncHandler(groupController.getGroupUsers))

// get all resources form a group
router.get('/:id/resources', asyncHandler(groupController.getGroupResources))

// add or remove user(s) from a group
router.patch('/:id/users', asyncHandler(groupController.updateGroupUsers))

// add or remove resource(s) from a group
router.patch('/:id/resources', asyncHandler(groupController.updateGroupResources))

export { router as groupRoutes }
