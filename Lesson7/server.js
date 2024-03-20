import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { DB_CONFIG } from './configs/db.config'

dotenv.config()
const app = express()

app.use(DB_CONFIG.resources.user.contextPath, UserRouter)

async function server() {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on ${process.env.PORT}`)
        })
    }
    catch (error) {
        console.log(error.message)
    }
}
server()