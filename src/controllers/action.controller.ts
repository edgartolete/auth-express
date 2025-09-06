import { Request, Response } from 'express'

export const actionController = {
  getAllActions: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getActionById: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  createAction: async (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateAction: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  deleteAction: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  }
}
