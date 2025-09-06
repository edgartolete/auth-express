import { Request, Response } from 'express'

export const resourceController = {
  getAllResources: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getResourceById: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  createResource: (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateResource: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  deleteResource: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getResourceUsers: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getResourceRoles: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  updateResourceUsers: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  updateResourceRoles: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  }
}
