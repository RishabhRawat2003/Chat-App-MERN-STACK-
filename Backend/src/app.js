import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, //change cors_origin in .env later
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routes/user.routes.js"
import searchRouter from './routes/search.routes.js'
import followersFollowingRouter from './routes/followersFollowing.routes.js'
import messageRouter from './routes/message.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/search", searchRouter)
app.use("/api/v1/users-details", followersFollowingRouter)
app.use("/api/v1/message", messageRouter)


export { app }