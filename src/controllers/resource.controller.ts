import { Request, Response } from 'express'

export const resourceController = {
  getAllResources: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getResourceById: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  createResource: async (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateResource: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  deleteResource: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getResourceUsers: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  updateResourceUsers: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  }
}
