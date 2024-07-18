import jwt from "jsonwebtoken"

const secretKey = process.env.JWT_SECRET

const authenticateJWT = (req, res, next) => {
  const token = req.header("x-auth-token")
  if (!token) return res.status(401).json({ message: "Authentication failed" })

  try {
    const decoded = jwt.verify(token, secretKey)
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).json({ message: "Invalid token" })
  }
}
