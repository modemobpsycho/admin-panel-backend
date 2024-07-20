import express from "express"
import cors from "cors"
import userRouter from "./router/userRouter"
import authRouter from "./router/authRouter"

const app = express()

app.use(express.json())

const corsOptions = {
  origin: ["https://itra-task-4-frontend.vercel.app", "http://localhost:5173"]
}

app.use(cors(corsOptions))

app.use("/api/users", userRouter)
app.use("/api", authRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`)
})

export default app
