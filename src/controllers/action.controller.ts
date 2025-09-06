import { Request, Response } from 'express'

export const actionController = {
  getAllActions: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getActionById: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  createAction: (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateAction: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  deleteAction: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  }
}
