import mongoose from 'mongoose'
import app from './app/app'
import dotenv from 'dotenv'
dotenv.config()



const PORT = process.env.PORT || 5000


const startServer = async () => {
  try {
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI as string || 'mongodb://localhost:27017/devcollab')
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

startServer();