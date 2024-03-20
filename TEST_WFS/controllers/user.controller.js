import jwt from 'jsonwebtoken';
import { UserInfoModel } from "../models/userInfo.model.js"
import bcrypt from 'bcrypt'
import { UserProfileModel } from '../models/userProfile.model.js';
const signUp = async (req, res) => {
    try {
        const { email, password, fullName, birthDay, birthPlace, nationality } = req.body
        const user = await UserInfoModel.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Nguoi dung da ton tai" })
        }
        const passwordHash = bcrypt.hashSync(password, 8)
        const newUser = await UserInfoModel.create({
            email,
            password: passwordHash,
            fullName,
            birthDay,
            birthPlace,
            nationality
        })
        return res.status(201).json({
            message: 'Success full register',
            data: newUser
        })
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to create" })
    }
}
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserInfoModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "User Not Found"
            })
        }
        const checkPassword = bcrypt.compareSync(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: "Password is not correct"
            })
        }
        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '2d'
        })
        return res.status(200).json({
            user,
            token
        })
    }
    catch (error) {
        res.status(403).json({ message: 'Unauthenticated' })
    }
}
const getProfileUserById = async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserProfileModel.findById(id).populate('userId')
        if (!user) {
            return res.status(400).json({
                message: "Password is not correct"
            })
        }
        res.status(200).json({
            message: 'Get user successful',
            user
        })
    }
    catch (error) {
        res.status(400).json({
            message: 'User Not Found'
        })
    }
}
const updateUserProfile = async (req, res) => {
    try {
        const id = req.params.id
        const skills = req.body.skills
        const favorites = req.body.favorites
        const goals = req.body.goals
        const user = await UserProfileModel.findById(id).populate('userId')
        if (!user) {
            return res.status(400).json({
                message: "Password is not correct"
            })
        }
        user.skills = skills.length > 0 ? [...skills] : ''
        user.favorites = favorites.length > 0 ? favorites : ''
        user.goals = goals.length > 0 ? [...goals] : ''
        await user.save()
        res.status(200).json({
            message: 'Get user successful',
            user
        })
    }
    catch (error) {
        res.status(400).json({
            message: 'User Not Found'
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserInfoModel.findById(id)
        if (!user) {
            return res.status(400).json({
                message: "Password is not correct"
            })
        }
        await UserModel.remove({ _id: userId })
        res.status(2004).json({
            message: 'Delete user successful',
        })
    }
    catch (error) {
        res.status(400).json({
            message: 'User Not Found'
        })
    }
}

export { getProfileUserById, signIn, signUp, updateUserProfile, deleteUser }