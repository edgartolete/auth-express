import express, { Express } from 'express'
import { userRoutes } from './routes/user.routes'
import { profileRoutes } from './routes/profile.routes'
import { authRoutes } from './routes/auth.routes'
import { errorHandler } from './utils/handler.util'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import timeout from 'connect-timeout'
import { config } from './config'
import { rateLimiter } from './middlewares/rate-limit.middleware'
import cors from 'cors'
import { corsOptions } from './middlewares/cors.middleware'
import cookieParser from 'cookie-parser'
import { roleRoutes } from './routes/role.routes'

const app: Express = express()
const port = 3000

app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(rateLimiter.global)
app.use(timeout(config.connectionTimeout))

app.use('/v1/auth', rateLimiter.auth, authRoutes)
app.use('/v1/users', userRoutes)
app.use('/v1/profile', profileRoutes)
app.use('/v1/roles', roleRoutes)

app.use(errorHandler)

app.get('/', (_, res) => {
  res.send('API working!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
