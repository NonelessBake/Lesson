import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import { UserRouter } from './routers/user.route.js';
dotenv.config();
const app = express()

app.use(express.json())

app.use('/user', UserRouter)
server()
async function server() {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        app.listen(process.env.PORT, () => { console.log(`App is running on ${process.env.PORT}`) })
    }
    catch (error) {
        console.log(error)
    }
}