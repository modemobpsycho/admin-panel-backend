import express from "express"
import cors from "cors"
import userRouter from "./router/userRouter"
import authRouter from "./router/authRouter"

const app = express()

app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  next()
})

app.use("/api/users", userRouter)
app.use("/api", authRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`)
})
