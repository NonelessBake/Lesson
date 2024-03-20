import mongoose from "mongoose";

const USERINFO_MODEL_NAME = 'UserInfo'
const UserInfoModel = mongoose.model(USERINFO_MODEL_NAME,
    new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        email: {
            type: String,
            unique: true
        },
        fullName: {
            type: String,
        },
        birthDay: {
            type: String,
        },
        birthPlace: {
            type: String,
        },
        nationality: {
            type: String,
        },
        password: {
            type: String,
        },
    })
)
export { UserInfoModel, USERINFO_MODEL_NAME }