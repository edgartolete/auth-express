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
import { actionRoutes } from './routes/action.route'
import { groupRoutes } from './routes/group.routes'
import { resourceRoutes } from './routes/resource.routes'
import { appRoutes } from './routes/app.routes'
import { appCodeGuard } from './middlewares/appcode-guard.middlware'

const app: Express = express()
const port = 3000

app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(rateLimiter.global)
app.use(timeout(config.connectionTimeout))

app.get('/', (_, res) => {
  res.send('v1 API working!')
})

app.use('/v1', appRoutes)
app.use('/v1/:appCode/auth', appCodeGuard, rateLimiter.auth, authRoutes)
app.use('/v1/:appCode/users', appCodeGuard, userRoutes)
app.use('/v1/:appCode/profile', appCodeGuard, profileRoutes)
app.use('/v1/:appCode/roles', appCodeGuard, roleRoutes)
app.use('/v1/:appCode/actions', appCodeGuard, actionRoutes)
app.use('/v1/:appCode/groups', appCodeGuard, groupRoutes)
app.use('/v1/:appCode/resources', appCodeGuard, resourceRoutes)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
