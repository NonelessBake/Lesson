import mongoose from "mongoose";
import Collections from "../database/collection.js";

const commentSchema = mongoose.Schema({
    postId: String,
    content: String,
    authorId: String,
})
const CommentsModel = mongoose.model(Collections.COMMENTS, commentSchema)
export default CommentsModel