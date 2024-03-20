import mongoose from "mongoose"

const ROLE_MODEL_NAME = 'Role'
const RoleModel = mongoose.model(ROLE_MODEL_NAME,
    new mongoose.Schema({
        name: String
    }))
export { ROLE_MODEL_NAME, RoleModel }