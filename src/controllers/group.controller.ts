import { Request, Response } from 'express'

export const groupController = {
  getAllGroups: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getGroupById: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  createGroup: (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateGroup: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  deleteGroup: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getGroupUsers: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getGroupResources: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getGroupRoles: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  updateGroupUsers: (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateGroupResources: (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateGroupRoles: (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  }
}
