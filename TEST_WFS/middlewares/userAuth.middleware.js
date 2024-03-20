import { UserInfoModel } from "../models/userInfo.model.js"
import jwt from 'jsonwebtoken'

const authentication = async (req, res, next) => {
    const bearerToken = req.headers.authorization
    if (!bearerToken) {
        return res.status(401).json({ message: "You are not logged in" })
    }
    const token = bearerToken.split(" ")[1]
    try {
        const checkToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = checkToken.id
        const user = await UserInfoModel.findById(userId)
        if (!user) {
            return res.status(401).json({ message: "You are not logged in" })
        }
        req.user = user
        req.userId = userId
        next()
    } catch (error) {
        return res.status(401).json({ message: "You are not logged in" })
    }
}
export { authentication }