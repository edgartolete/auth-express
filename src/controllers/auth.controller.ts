import { Request, Response } from 'express'
import { db } from '../db'
import { and, desc, eq, or } from 'drizzle-orm'
import { users } from '../db/schema/users.schema'
import { config } from '../config'
import { generateRandomCode, generateRandomNumbers } from '../utils/helpers.util'
import { sendVerificationCode } from '../services/email.service'
import * as bcrypt from 'bcrypt'
import { profiles } from '../db/schema/profiles.schema'
import { generateAccessToken, generateRefreshToken, validateToken } from '../utils/token.util'
import { sessions } from '../db/schema/sessions.schema'
import { addDays, isBefore } from 'date-fns'
import ms from 'ms'
import { redisClient } from '../services/cache.service'

export const authController = {
  register: async (req: Request, res: Response) => {
    const { username, email, password, code, autoLogin } = req.body

    const searchResult = await db.query.users.findFirst({
      where: or(eq(users.username, username), eq(users.email, email))
    })

    if (searchResult) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      })
    }

    if ((config.auth.register.emailVerify || !!config.auth.register.codeGeneration) && !code) {
      let generatedCode = ''

      if (config.auth.register.codeGeneration === 'numbers') {
        generatedCode = generateRandomNumbers()
      }

      if (config.auth.register.codeGeneration === 'random') {
        generatedCode = generateRandomCode()
      }

      await redisClient.setex(
        `${username}-${email}`,
        config.auth.register.codeExpiry,
        generatedCode
      )

      const sendResponse = await sendVerificationCode(email, generatedCode)

      if (sendResponse.error) {
        return res.status(400).json({ success: false, message: 'Failed to send email' })
      }

      return res.status(200).json({ success: true, message: 'Verification code sent' })
    }

    const storedCode = await redisClient.get(`${username}-${email}`)

    if (config.auth.register.emailVerify && !!code && storedCode !== code) {
      return res.status(400).json({ success: false, message: 'Code is invalid or expired' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const [latest] = await db
      .select({ orderId: users.orderId })
      .from(users)
      .orderBy(desc(users.orderId))
      .limit(1)

    const newUser = {
      username,
      email,
      password: hashedPassword,
      orderId: latest?.orderId ? Number(latest?.orderId + 1) : 1
    }

    const result = await db.insert(users).values(newUser)

    const userId = result[0].insertId

    await db.insert(profiles).values({ userId })

    if (autoLogin) {
      //TODO: login the user after signup
    }

    return res.status(201).json({ success: true, message: 'Registered successfully' })
  },

  login: async (req: Request, res: Response) => {
    const { username = '', email = '', password, rememberMe } = req.body

    const ipAddress = req.ip || ''

    const userAgent = req.headers['user-agent'] || ''

    const searchResult = await db.query.users.findFirst({
      with: { profile: true, role: true },
      where: or(eq(users.username, username), eq(users.email, email))
    })

    if (!searchResult) {
      res.status(400).json({ success: false, message: 'User not found' })
    }

    const isPasswordMatched = bcrypt.compareSync(password, searchResult!.password)

    if (!isPasswordMatched) {
      return res.status(400).json({ success: false, message: 'Password incorrect' })
    }

    const payload = {
      id: searchResult!.id,
      username: searchResult!.username,
      role: searchResult?.role?.name || null,
      profileId: searchResult?.profile?.id!
    }

    const sessionResult = await db.query.sessions.findFirst({
      where: and(eq(sessions.userId, searchResult!.id), eq(sessions.userAgent, userAgent))
    })

    if (sessionResult?.isActive) {
      return res.status(400).json({ success: false, message: 'You are already loggedin' })
    }

    const accessToken = generateAccessToken(payload)

    const refreshToken = generateRefreshToken(payload, rememberMe)

    const refreshExpiryMilliseconds = ms(
      rememberMe ? config.auth.login.rememberMeDuration : config.auth.login.refreshTokenDuration
    )

    const refreshExpiryDays = refreshExpiryMilliseconds / (1000 * 60 * 60 * 24)

    const newSession = {
      ipAddress,
      userAgent,
      refreshToken,
      userId: searchResult!.id,
      expiryDate: addDays(new Date(), refreshExpiryDays)
    }

    const sessionSearch = await db.query.sessions.findFirst({
      where: and(eq(sessions.userId, searchResult!.id), eq(sessions.userAgent, userAgent))
    })

    if (sessionSearch?.id) {
      await db
        .update(sessions)
        .set({
          refreshToken,
          ipAddress,
          expiryDate: addDays(new Date(), refreshExpiryDays),
          isActive: true
        })
        .where(eq(sessions.id, sessionSearch.id))
    }

    if (!sessionSearch) {
      await db.insert(sessions).values(newSession)
    }

    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: config.isProduction,
        secure: config.isProduction,
        sameSite: 'none',
        maxAge: refreshExpiryMilliseconds
      })
      .status(200)
      .json({ success: true, message: 'User logged in successfully', accessToken })
  },
  logout: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const sessionResult = await db.query.sessions.findFirst({
      columns: { userId: true },
      where: eq(sessions.refreshToken, refreshToken)
    })

    if (!sessionResult) {
      return res.status(400).json({ success: false, message: 'Refresh token expired or invalid' })
    }

    await db
      .update(sessions)
      .set({ isActive: false })
      .where(eq(sessions.refreshToken, refreshToken))

    res.status(200).json({ success: true, message: 'User logged out successfully' })
  },
  refreshToken: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const sessionResult = await db.query.sessions.findFirst({
      where: eq(sessions.refreshToken, refreshToken),
      with: { user: true }
    })

    const { expired, decoded } = validateToken(refreshToken)

    if (
      expired ||
      (sessionResult && isBefore(new Date(sessionResult?.expiryDate || ''), new Date()))
    ) {
      await db
        .update(sessions)
        .set({ isActive: false })
        .where(eq(sessions.refreshToken, refreshToken))

      return res.status(400).json({ success: false, message: 'Token is already expired' })
    }

    if (!sessionResult?.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot refresh as this user already logout. Session ended.'
      })
    }

    const { id, username, role, profileId } = decoded || {}

    const payload = { id: id!, username: username!, role, profileId: profileId! }

    const accessToken = generateAccessToken(payload)

    return res
      .status(200)
      .json({ success: true, message: 'Token refreshed successfully', accessToken })
  },
  forgotRequest: async (req: Request, res: Response) => {
    const { email } = req.body

    const userResult = await db.query.users.findFirst({
      columns: { id: true },
      where: eq(users.email, email)
    })

    if (!userResult?.id) {
      return res.status(400).json({ success: false, message: 'Email is not yet registered' })
    }

    let generatedCode = ''

    if (config.auth.register.codeGeneration === 'numbers') {
      generatedCode = generateRandomNumbers()
    }

    if (config.auth.register.codeGeneration === 'random') {
      generatedCode = generateRandomCode()
    }

    await redisClient.setex(`forgot-${email}`, config.auth.register.codeExpiry, generatedCode)

    const sendResponse = await sendVerificationCode(email, generatedCode)

    if (sendResponse.error) {
      return res.status(400).json({ success: false, message: 'Failed to send email' })
    }

    return res.status(200).json({ success: true, message: 'Verification code sent' })
  },
  forgotSubmit: async (req: Request, res: Response) => {
    const { code, email, password } = req.body

    const storedCode = await redisClient.get(`forgot-${email}`)

    if (storedCode !== code) {
      return res.status(400).json({ success: false, message: 'Code is invalid or expired' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email))

    const userResult = await db.query.users.findFirst({
      columns: { id: true },
      where: eq(users.email, email)
    })

    if (!userResult?.id) {
      return res.status(400).json({ success: false, message: 'User not found' })
    }

    await db.delete(sessions).where(eq(sessions.userId, userResult.id))

    await redisClient.del(`forgot-${email}`)

    res.status(200).json({ success: true, message: 'Password updated successfully' })
  },
  resetPassword: async (req: Request, res: Response) => {
    const { password } = req.body

    const userId = req.user!.id

    const hashedPassword = bcrypt.hashSync(password, 10)

    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId))

    return res.status(200).json({ success: true, message: 'Password reset successfully' })
  }
}
