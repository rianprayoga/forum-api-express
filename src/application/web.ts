import express from "express"
import { publicRouter } from "../route/public-router"
import { errorMiddleware } from "../middleware/error-middleware"
import { authenticatedRouter } from "../route/auth-router"

export const web = express()
web.use(express.json())
web.use(publicRouter)
web.use(authenticatedRouter)
web.use(errorMiddleware)