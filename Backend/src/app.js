import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { Server } from 'socket.io'
import http from 'http'


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN, //change cors_origin in .env later
        methods: ["GET", "POST"],
        credentials: true
    }
})

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


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
import postRouter from './routes/post.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/search", searchRouter)
app.use("/api/v1/users-details", followersFollowingRouter)
app.use("/api/v1/message", messageRouter)
app.use("/api/v1/posts", postRouter)

export { app, server, io }
