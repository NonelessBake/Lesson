import express from 'express';
import { deleteUser, getProfileUserById, signIn, signUp, updateUserProfile } from '../controllers/user.controller.js';
import { authentication } from '../middlewares/userAuth.middleware.js';

const UserRouter = express.Router()
UserRouter.get('/:id', getProfileUserById)
UserRouter.post('/sign-up', signUp)
UserRouter.post('/login', signIn)
UserRouter.put('/:id', authentication, updateUserProfile)
UserRouter.delete('/:id', authentication, deleteUser)

export { UserRouter }