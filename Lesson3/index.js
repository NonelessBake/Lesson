import express from 'express'
import mongoose from 'mongoose'
import UsersModel from './models/users.js'
import PostsModel from './models/posts.js'
import CommentsModel from './models/comments.js'
import { SERVER_CONFIG } from './configs/server.config.js'

const urlDB = `mongodb+srv://${SERVER_CONFIG.RESOURCES.username}:${SERVER_CONFIG.RESOURCES.password}@cluster0.3ckpb3m.mongodb.net/${SERVER_CONFIG.RESOURCES.databaseName}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(urlDB)
const app = express()
app.use(express.json());



// Viết API việc đăng ký user với userName, id sẽ được là một string ngẫu nhiên, không được phép trùng, bắt đầu từ ký tự US(ví dụ: US8823).
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const requireRegister = (key) => {
    return `${key} is required`
}

app.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName) throw new Error(requireRegister('Username'));
        if (!email) throw new Error(requireRegister('Email'));
        if (!password) throw new Error(requireRegister('Password'));
        if (!new RegExp(emailRegex).test(email)) throw new Error('Email is not valid')

        const existedEmail = await UsersModel.findOne({
            email
        })
        if (existedEmail) throw new Error('Email is already existed')

        const createdUser = await UsersModel.create({
            userName,
            email,
            password
        })

        delete createdUser.password
        res.status(201).json({
            data: createdUser,
            success: true,
            message: 'Register Successfully'
        })

    } catch (error) {
        res.status(403).json({
            data: null,
            success: false,
            error: error.message
        });
    }
})
// Viết API cho phép user tạo bài post(thêm bài post, xử lý id tương tự user).
app.post('/:userId/post', async (req, res) => {
    try {
        const { content } = req.body
        const { userId } = req.params

        const user = await UsersModel.findById(userId)
        if (!user) throw new Error('User is invalid')

        if (content.length === 0) throw new Error(`Content can't be empty`)
        const createdPost = await PostsModel.create({
            content,
            authorId: userId,
        })
        res.status(201).json({
            data: createdPost,
            message: 'Posted Successfully',
            success: true
        })
    }
    catch (error) {
        res.status(403).json({
            success: false,
            error: error.message
        })
    }

})
// Viết API cho phép user chỉnh sửa lại bài post(chỉ user tạo bài viết mới được phép chỉnh sửa).
app.patch('/:userId/post/:postId', async (req, res) => {
    try {
        const { content } = req.body
        const { userId, postId } = req.params

        const post = await PostsModel.findById(postId)
        if (!post) throw new Error('Post is not existed')
        if (userId !== post.authorId) throw new Error('User invalid')

        if (content.length === 0) throw new Error(`Content can't be empty`)

        post.content = content
        await post.save()
        res.status(200).json({
            data: content,
            message: 'Update Successfully',
            success: true
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
})
// Viết API cho phép user được comment vào bài post
app.post('/:userId/post/:postId/comment', async (req, res) => {
    try {
        const { content, userCommentId } = req.body
        const { postId, userId } = req.params

        const post = await PostsModel.findById(postId)
        if (!post) throw new Error('Post is not existed')
        if (userId !== post.authorId) throw new Error('User invalid')

        const userComment = await UsersModel.findById(userCommentId)
        if (!userComment) throw new Error('User is invalid')
        if (content.length === 0) throw new Error(`Content can't be empty`)

        const createdComment = await CommentsModel.create({
            content,
            authorId: userCommentId,
            postId
        })
        res.status(201).json({
            message: "Comment success",
            success: true,
            data: createdComment
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
})
// Viết API cho phép user chỉnh sửa comment(chỉ user tạo comment mới được sửa)
app.patch("/:userId/post/:postId/comment/:commentId", async (req, res) => {
    try {
        const { postId, commentId, userId } = req.params
        const { userCommentId, content } = req.body

        const post = await PostsModel.findById(postId)
        if (!post) throw new Error('Post is not existed')
        if (userId !== post.authorId) throw new Error('User invalid')

        const comment = await CommentsModel.findById(commentId)
        if (!comment) throw new Error('Comment is not existed')
        if (userCommentId !== comment.authorId) throw new Error('Something is wrong')

        if (content.length === 0) throw new Error(`Content can't be empty`)

        comment.content = content
        await comment.save()

        res.status(200).json({
            message: "Comment success",
            success: true,
            data: content
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
})
// Viết API lấy tất cả comment của một bài post.
// Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId
app.get("/:userId/post/:postId/comment", async (req, res) => {
    try {
        const { postId, userId } = req.params

        const post = await PostsModel.findById(postId)
        if (!post) throw new Error('No post found')
        if (post.authorId !== userId) throw new Error('Something is wrong')

        const comments = await CommentsModel.find({
            postId
        })
        if (comments.length === 0) throw new Error('Become the first one comment')

        res.status(200).json({
            success: true,
            message: "Get comments by postId success",
            data: comments
        })
    }
    catch (error) {
        res.status(404).json({
            error: error.message,
            success: false,
            data: null
        })
    }

})
// Viết API lấy tất cả các bài post, 3 comment đầu(dựa theo index) của tất cả user.
app.get("/posts", async (req, res) => {
    try {
        const posts = await PostsModel.find()
        const comments = await CommentsModel.find()

        if (!posts) throw new Error('No post found')

        const postsList = posts.map(post => {
            const commentsList = comments.filter(comment => comment.postId === post.id)
            post.comments = commentsList.slice(0, 3)
            return post
        })
        res.status(200).json({
            success: true,
            message: "Get posts success",
            data: postsList
        })
    }
    catch (error) {
        res.status(404).json({
            error: error.message,
            success: false,
            data: null
        })
    }
})

app.listen(SERVER_CONFIG.PORT, () => { console.log(`App is running on ${urlPort}`) })