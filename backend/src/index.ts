import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.route.ts'
import requestRoutes from './routes/request.route.ts'
import timeRoutes from './routes/time.route.ts'

import { connectDB } from './config/database.ts'
import { HttpError } from './utils/error.ts'

const app = express()
const port = process.env.PORT || 5000

//adding cors middleware
const corsOptions = {
  methods: 'GET, POST, PUT, DELETE',
  origin: '*',
  allowHeaders: 'Content-Type, Authorization'
}

//cors
app.use(cors(corsOptions))

//json data
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})
app.use('/api/auth', authRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/time', timeRoutes)

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error!'
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
