import express from "express"
import {
  getUsers,
  deleteUsers,
  updateUserAccess,
  loginUser,
  redirectUser
} from "../controllers/userController"

const userRouter = express.Router()

userRouter.get("/", getUsers)

userRouter.post("/login", loginUser)
userRouter.put("/", updateUserAccess)
userRouter.delete("/", deleteUsers)
userRouter.get("*", redirectUser)

export default userRouter
