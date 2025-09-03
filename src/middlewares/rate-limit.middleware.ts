import { rateLimit } from 'express-rate-limit'

const message = {
  success: false,
  message: 'Too many attempts. Please try again later.'
}

export const rateLimiter = {
  global: rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // allow 100 requests per 10 minutes per IP
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message
  }),
  auth: rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 15, // allow 15 requests per 10 minutes per IP
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message
  })
}
