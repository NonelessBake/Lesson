import mongoose from "mongoose";
import Collections from "../database/collection.js";

const postSchema = mongoose.Schema({
    content: String,
    authorId: String
})
const PostsModel = mongoose.model(Collections.POSTS, postSchema)
export default PostsModel