import { Response, Request } from "express"
import { prismaClient } from "../prisma/database"
import bcrypt from "bcrypt"
import TokenService from "../service/tokenService"
import { maxAgeCookie, saltRounds } from "../constants/constants"

const tokenService = new TokenService()

export const getUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    orderBy: { id: "asc" }
  })
  res.send(users)
}

export const createUser = async (req: Request, res: Response) => {
  const { username, position, email, password, access } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await prismaClient.user.create({
      data: {
        username,
        position,
        email,
        password: hashedPassword,
        access
      }
    })

    const { id: userId, email: userEmail } = user

    const payload = { id: userId, email: userEmail }
    const accessToken = tokenService.generateAccessToken(payload)
    const refreshToken = tokenService.generateRefreshToken(payload)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: maxAgeCookie
    })

    return res.status(201).json({ user, accessToken })
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).json({ message: "Email already exists" })
    }
    console.error("Error during user creation:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prismaClient.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    if (!user.access) {
      return res.status(403).json({ message: "User account is blocked" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (passwordMatch) {
      const payload = { id: user.id, email: user.email }
      const accessToken = tokenService.generateAccessToken(payload)
      const refreshToken = tokenService.generateRefreshToken(payload)

      await prismaClient.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      })

      return res
        .status(200)
        .json({ accessToken, refreshToken, username: user.username })
    } else {
      return res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.error("Error during login:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const updateUserAccess = async (req: Request, res: Response) => {
  const { userIds, access } = req.body

  try {
    await prismaClient.user.updateMany({
      where: {
        id: {
          in: userIds
        }
      },
      data: {
        access
      }
    })
    const users = await prismaClient.user.findMany({ orderBy: { id: "asc" } })
    res.json(users)
  } catch (error) {
    console.error("Failed to update user access:", error)
    res.status(500).json({ error: "Failed to update user access." })
  }
}

export const deleteUsers = async (req: Request, res: Response) => {
  const { userIds } = req.body

  console.log("Received delete request for users with IDs:", userIds)

  try {
    const deletedUsers = await prismaClient.user.deleteMany({
      where: {
        id: {
          in: userIds
        }
      }
    })

    console.log("Users deleted successfully:", deletedUsers)

    res.sendStatus(204)
  } catch (error) {
    console.error("Failed to delete users:", error)
    res.status(500).json({ error: "Failed to delete users." })
  }
}

export const redirectUser = async (req: Request, res: Response) => {
  res.redirect("/api/login")
}
