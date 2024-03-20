import mongoose from "mongoose";
import { ROLE_MODEL_NAME } from "./role.model";

const USER_MODEL_NAME = 'User'
const UserModel = mongoose.model(USER_MODEL_NAME,
    new mongoose.Schema({
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: ROLE_MODEL_NAME
            }
        ]
    }))
export { USER_MODEL_NAME, UserModel }