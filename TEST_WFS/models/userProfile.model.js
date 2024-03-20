import mongoose from "mongoose";
import { USERINFO_MODEL_NAME } from "./userInfo.model.js";

const USERPROFILE_MODEL_NAME = 'UserProfile'
const UserProfileModel = mongoose.model(USERPROFILE_MODEL_NAME,
    new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: USERINFO_MODEL_NAME,
        },
        skills: [{
            type: String,
        }],
        favorites: {
            type: String
        },
        goals: [{
            type: String
        }]
    })
)
export { UserProfileModel, USERPROFILE_MODEL_NAME }