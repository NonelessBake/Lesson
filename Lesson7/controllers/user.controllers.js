import { UserModel } from "../models/user.model"
import bcrypt from 'bcrypt'
const saltRounds = 10;
export const UserController = {
    getAllUser: async (req, res) => {
        try {
            const users = await UserModel.find()
            res.status(200).json({
                data: users,
                message: 'Get all users succes'
            })
        }
        catch (error) {

        }
    },
    getUserById: async (req, res) => {
        try {
            const userId = req.params.id
            const user = await UserModel.findById(userid)
            res.status(200).json({
                data: user,
                message: 'Get user success'
            })
        }
        catch (error) {

        }
    },
    signup: async (req, res) => {
        try {
            const { email, username, password } = req.body
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(password, salt)
            const newUser = {
                email,
                username,
                password: hash,
                salt
            }
            await UserModel.create(newUser)
            res.status(201).json({
                message: 'Register successful'
            })
        }
        catch (error) {

        }
    },
    signin: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await UserModel.findOne({ email })
            const hashingPwd = bcrypt.hashSync(password, user.salt)
            if (hashingPwd !== user.password) throw new Error('Wrong email or password')
            res.status(201).json({
                message: 'Login Successful'
            })
        }
        catch (error) {

        }
    },
    changePassword: async (req, res) => {
        try {
            const userId = req.params.id
            const { email, password, newPassword } = req.body
            const user = await UserModel.findById(userId)
            const hashPassword = bcrypt.hashSync(password, user.salt)
            if (hashPassword !== user.password || email !== user.email) throw new Error('You are not loggin')
            const newSalt = bcrypt.genSaltSync(saltRounds)
            const hashNewPassword = bcrypt.hashSync(newPassword, newSalt)
            user.password = hashNewPassword
            user.salt = newSalt
            await user.save()
            res.status(201).json({
                message: 'Password has been changed'
            })
        }
        catch (error) {

        }
    },
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id
            const { email, password, newPassword } = req.body
            const user = await UserModel.findById(userId)
            const hashPassword = bcrypt.hashSync(password, user.salt)
            if (hashPassword !== user.password || email !== user.email) throw new Error('You are not loggin')
            await UserModel.remove({ _id: userId })
        }
        catch (error) {

        }
    }
}