import mongoose from "mongoose";
import Collections from "../database/collection.js";

const userChema = mongoose.Schema({
    userName: String,
    email: String
})
const UsersModel = mongoose.model(Collections.USERS, userChema)
export default UsersModel