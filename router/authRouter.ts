import express from "express"
import { loginUser, createUser } from "../controllers/userController"

const authRouter = express.Router()

authRouter.post("/login", loginUser)
authRouter.post("/user", createUser)

export default authRouter
