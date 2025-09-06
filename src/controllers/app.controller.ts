import { Request, Response } from 'express'

export const appController = {
  getAllApps: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getAppById: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  createApp: (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateApp: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  deleteApp: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  login: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  logout: (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  }
}
