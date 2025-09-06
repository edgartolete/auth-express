import { Request, Response } from 'express'

export const appController = {
  getAllApps: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  getAppById: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  createApp: async (req: Request, res: Response) => {
    res.status(201).json({ success: true })
  },
  updateApp: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  deleteApp: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  login: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  },
  logout: async (req: Request, res: Response) => {
    res.status(200).json({ success: true })
  }
}
