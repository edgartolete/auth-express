import { Request, Response } from 'express'

export const groupController = {
  getAllGroups: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getGroupById: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  createGroup: async (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateGroup: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  deleteGroup: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getGroupUsers: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getGroupResources: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  updateGroupUsers: async (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateGroupResources: async (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  }
}
