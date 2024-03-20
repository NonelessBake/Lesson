import express from 'express'
import { UserController } from '../controllers/user.controllers'
const UserRouter = express.Router()
UserRouter.get('/', UserController.getAllUser)
UserRouter.get('/:id', UserController.getUserById)
UserRouter.post('/signup', UserController.signup)
UserRouter.post('/signin', UserController.signin)
UserRouter.put('/:id', UserController.changePassword)
UserRouter.delete('/:id', UserController.deleteUser)
export default UserRouter