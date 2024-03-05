import express from 'express'

const app = express()
const urlPort = 8080
const usersDB = 'http://localhost:3000/users'
const postsDB = 'http://localhost:3000/posts'
const commentsDB = 'http://localhost:3000/comments'
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const generateId = (strKey, arr) => {
    const id = strKey + Math.floor(Math.random() * 10000)
    const duplicateId = arr.findIndex(ele => ele.id === id)
    if (duplicateId !== -1) {
        generateId(arr)
    }
    return id
}
const updateToDB = async (method, url, data) => {
    await fetch(url, {
        method,
        body: JSON.stringify(data)
    })
}

app.use(express.json());

// Viết API việc đăng ký user với userName, id sẽ được là một string ngẫu nhiên, không được phép trùng, bắt đầu từ ký tự US(ví dụ: US8823).
app.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName) throw new Error('userName is required!');
        if (!email) throw new Error('email is required!');
        if (!password) throw new Error('password is required!');
        if (!new RegExp(emailRegex).test(email)) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: 'Email is not valid'
                })
        }
        const usersData = await fetch(usersDB)
        const users = await usersData.json()
        const userExist = users.findIndex(user =>
            user.userName === userName ||
            user.email === email
        )
        if (userExist !== -1) throw new Error('Username or email already exists')
        const newUser = {
            id: generateId('US', users),
            userName,
            email,
            password
        }
        await updateToDB("POST", usersDB, newUser)
        res.status(201).json({
            data: newUser,
            success: true,
            message: 'Register success'
        });
    } catch (error) {
        res.status(403).json({
            data: null,
            success: false,
            error: error.message
        });
    }
})
// Viết API cho phép user tạo bài post(thêm bài post, xử lý id tương tự user).
app.post('/posts', async (req, res) => {
    try {
        const { content, userId } = req.body

        const usersData = await fetch(usersDB)
        const users = await usersData.json()

        const userExist = users.findIndex(user => user.id === userId)
        if (userExist === -1) {
            return res.status(403).json({
                success: false,
                error: `Cannot create post during non user exists`
            })
        }
        if (!content) throw new Error(`Content can't be empty`)
        const newPost = {
            id: crypto.randomUUID(),
            content,
            authorId: userId
        }
        await updateToDB("POST", postsDB, newPost)

        res.status(201).json({
            data: newPost,
            success: true,
            message: 'Post create success'
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
app.patch('/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params
        const { content, userId } = req.body

        const postsData = await fetch(postsDB)
        const posts = await postsData.json()

        const post = posts.find(post => post.id === postId)
        if (!post || post.authorId !== userId) {
            return res.status(400).json({
                success: false,
                error: "Non post found",
                data: null
            })
        }
        if (!content) throw new Error(`Content can't be empty`)
        post.content = content

        await updateToDB("PATCH", `${postsDB}/${postId}`, post)

        res.status(202).json({
            success: true,
            message: 'Success to update post',
            data: post
        })
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        })
    }
})
// Viết API cho phép user được comment vào bài post
app.post('/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params
        const { userId, content } = req.body
        /* 
        => Check userId exist && logged in 
        */
        const usersData = await fetch(usersDB)
        const users = await usersData.json()
        const user = users.find(user => user.id === userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not exists",
                data: null
            })
        }

        const postsData = await fetch(postsDB)
        const posts = await postsData.json()
        const post = posts.find(post => post.id === postId)
        if (!post) {
            return res.status(400).json({
                success: false,
                error: "Non post found",
                data: null
            })
        }

        if (!content) throw new Error(`Content can't be empty`)

        const newComment = {
            id: crypto.randomUUID(),
            postId,
            content,
            authorId: userId
        }
        await updateToDB("POST", commentsDB, newComment)

        res.status(202).json({
            message: "Comment success",
            success: true,
            data: newComment
        })
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        })
    }
})
// Viết API cho phép user chỉnh sửa comment(chỉ user tạo comment mới được sửa)
app.patch("/post/:postId/comments/:commentId", async (req, res) => {
    try {
        const { postId, commentId } = req.params
        const { userId, content } = req.body

        const commentsData = await fetch(postsDB)
        const comments = await commentsData.json()
        const comment = comments.find(comment => comment.id === commentId)
        if (userId !== comment.authorId) {
            return res.status(404).json({
                success: false,
                error: "Author is not correct",
                data: null
            })
        }
        if (postId !== comment.postId) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
                data: null
            })
        }
        if (!comment) {
            return res.status(400).json({
                success: false,
                error: "Non comment found",
                data: null
            })
        }
        if (!content) throw new Error(`Content can't be empty`)
        comment.content = content
        await updateToDB("PATCH", `${commentsDB}/${commentId}`, comment)
        res.status(202).json({
            message: "Comment success",
            success: true,
            data: content
        })
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        })
    }
})
// Viết API lấy tất cả comment của một bài post.
app.get("/posts/:postId/comments", async (req, res) => {
    try {
        const { postId } = req.params
        const postsData = await fetch(postsDB)
        const posts = await postsData.json()
        const post = posts.find(post => post.id === postId)
        if (!post) {
            res.status(400).json({
                error: "No post found",
                data: null,
                success: false
            })
        }
        const commentsData = await fetch(commentsDB)
        const comments = await commentsData.json()
        const commentsList = comments.filter(comment => comment.postId === post.id)
        res.status(200).json({
            success: true,
            message: "Get comments by post id success",
            data: commentsList
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
        const postsData = await fetch(postsDB)
        const posts = await postsData.json()

        const commentsData = await fetch(commentsDB)
        const comments = await commentsData.json()

        const postsList = posts.map(post => {
            const commentsList = comments.filter(comment => comment.postId === post.id)
            post.comments = commentsList
            return post
        }
        )
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
// Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId
app.get("/posts/:postId", async (req, res) => {
    try {
        const { postId } = req.params
        const postsData = await fetch(postsDB)
        const posts = await postsData.json()
        const post = posts.find(post => post.id === postId)
        if (!post) {
            res.status(400).json({
                error: "No post found",
                data: null,
                success: false
            })
        }
        const commentsData = await fetch(commentsDB)
        const comments = await commentsData.json()
        const commentsList = comments.filter(comment => comment.postId === postId)
        res.status(200).json({
            message: "Get post success",
            success: true,
            data: {
                post,
                commentsList
            }
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
app.listen(urlPort, () => { console.log(`App is running on ${urlPort}`) })