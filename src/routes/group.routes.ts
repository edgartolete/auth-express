import express, { Router } from 'express'
import { groupController } from '../controllers/group.controller'

const router: Router = express.Router({ mergeParams: true })

// get all groups
router.get('/', groupController.getAllGroups)

// get single group
router.get('/:id', groupController.getGroupById)

// add group
router.post('/', groupController.createGroup)

// update group
router.patch('/:id', groupController.updateGroup)

// delete group
router.delete('/:id', groupController.deleteGroup)

// get all users from a group
router.get('/:id/users', groupController.getGroupUsers)

// get all resources form a group
router.get('/:id/resources', groupController.getGroupResources)

// get all roles form a group
router.get('/:id/roles', groupController.getGroupRoles)

// add or remove user(s) from a group
router.patch('/:id/users', groupController.updateGroupUsers)

// add or remove resource(s) from a group
router.patch('/:id/resources', groupController.updateGroupResources)

// add or remove role(s) from a group
router.patch('/:id/roles', groupController.updateGroupRoles)

export { router as groupRoutes }
