import express from 'express'
import { users, posts } from './data.js'
const app = express()
const port = 3000

app.use(express.json())
/* const bodyReq = req.body

// const listUsers = [
//     {
//         id: 1,
//         fullName: "Jackie",
//         age: 5,
//         class: "5A",
//     },
//     {
//         id: 2,
//         fullName: "Juli MTP",
//         age: 5,
//         class: "5A",
//     },
//     {
//         id: 3,
//         fullName: "Denis",
//         age: 5,
//         class: "5B",
//     },
// ];

// app.get('/users', (req, res) => {
//     res.status(200).json(listUsers)
// })
// app.get('/user/:id', (req, res) => {
//     const { id } = req.params
//     const user = listUsers.find(user => user.id === id)
//     if (!user) {
//         return res.status(404).json({ errorMsg: "User not found" })
//     }
//     else { res.status(200).json({ data: user }) }
// })

// app.post('/users', (req, res) => {
//     const newUser = req.body
//     const persistUser = {
//         id: crypto.randomUUID(),
//         fullName: newUser.fullName,
//         age: newUser.age,
//         class: newUser.class
//     }
//     listUsers.push(persistUser)
//     res.status(200).json(persistUser)
// })
// app.put('/user', (req, res) => {

// })
// app.put('/user/:id', (req, res) => {

// })
// app.delete('/user/:id', (req, res) => {

// })

*/
const strNormalize = (str) => str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Viết API lấy thông tin của user với id được truyền trên params.
app.get('/user/:id', (req, res) => {
    const { id } = req.params
    const user = users.find(user => user.id === id)
    if (!user) {
        return res
            .status(404)
            .json({ errMsg: 'User not found' })
    }
    return res
        .status(200)
        .json({ data: user })
})
// Viết API tạo user với các thông tin như trên users, với id là random (uuid), email là duy nhất, phải kiểm tra được trùng email khi tạo user.
app.post('/signup/', (req, res) => {
    const { userName, email, age, avatar } = req.body
    if (!userName || !email) {
        return res.status(422).json({ errMsg: "Username or email is not valid" })
    }
    if (!new RegExp(emailRegex).test(email)) {
        return res
            .status(400)
            .json({ msg: 'Email is not valid' })
    }
    let findUser = users.find(user =>
        user.userName === userName || user.email === email)
    if (findUser) {
        return res
            .status(422)
            .json({ errMsg: "Username or Email is already existed" })
    }
    return res
        .status(201)
        .json({
            msg: 'Successful account registration ',
            data: {
                id: crypto.randomUUID(),
                userName,
                email,
                age: age || '',
                avatar: avatar || ''
            }
        })
})

// Viết API lấy ra các bài post của user được truyền userId trên params.
app.get('/posts/:userId', (req, res) => {
    const { userId } = req.params
    const postsByUser = posts.filter(post => post.userId === userId)
    if (!postsByUser) {
        return res
            .status(404)
            .json({ errMsg: "Post not found" })
    }
    return res
        .status(200)
        .json({ data: postsByUser })
})

// Viết API thực hiện tạo bài post với id của user được truyền trên params.
app.post('/post/:id', (req, res) => {
    const { id } = req.params
    const { content, isPublic } = req.body
    const date = new Date()
    let findUser = users.findIndex(user => user.id === id)
    if (findUser === -1) {
        return res
            .status(422)
            .json({ errMsg: "You are not logged in" })
    }
    if (!content) {
        return res
            .status(422)
            .json({ errMsg: "Content can't be empty" })
    }
    const newPost = {
        userId: id,
        postId: crypto.randomUUID(),
        content,
        createdAt: date,
        isPublic: isPublic ? isPublic : false,
    }
    posts.push(newPost)
    return res
        .status(201)
        .json({
            msg: "Succesful to create a post",
            data: newPost
        })

})

// Viết API cập nhật thông tin bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.patch('/post/:postId', (req, res) => {
    const { postId } = req.params
    const { id, content } = req.body
    const findPost = posts.find(post => post.postId === postId)
    const findPostIndex = posts.findIndex(post => post.postId === postId)
    if (!findPost && findPostIndex === -1) {
        return res
            .status(404)
            .json({ errMsg: 'Post not found' })
    }
    if (findPost.userId !== id) {
        return res
            .status(404)
            .json({ errMsg: 'Fail to update post' })
    }
    if (!content) {
        return res
            .status(400)
            .json({ errMsg: `Content can't be empty` })
    }
    const date = new Date()
    findPost.content = content
    findPost.updatedAt = date
    posts[findPostIndex] = findPost
    return res
        .status(200)
        .json({
            msg: "Successful update post",
            data: findPost
        })
})

// Viết API xoá bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.delete('/post/:postId', (req, res) => {
    const { postId } = req.params
    const { id } = req.body
    const findPost = posts.find(post => post.postId === postId)
    if (!findPost) {
        return res
            .status(404)
            .json({ errMsg: 'Post not found' })
    }
    if (findPost.userId !== id) {
        return res
            .status(404)
            .json({ errMsg: 'Fail to update post' })
    }
    const postIndex = posts.findIndex(post => post.postId === postId)
    posts.splice(postIndex, 1)
    return res
        .status(200)
        .json({ msg: 'Succesful delete post' })
})

// Viết API tìm kiếm các bài post với content tương ứng được gửi lên từ query params.

app.get('/post', (req, res) => {
    const { keyword } = req.query
    const findPosts = posts.filter(post => strNormalize(post.content).includes(strNormalize(keyword))
    )
    if (findPosts.length === 0 || !findPosts) {
        return res
            .status(404)
            .json({ errMsg: 'No post found' })
    }
    return res.status(200).json({ data: findPosts })
})

// Viết API lấy tất cả các bài post với isPublic là true, false thì sẽ không trả về.
app.get('/posts', (req, res) => {
    const postPublic = posts.filter(post => post.isPublic === true)
    if (!postPublic) {
        return res.status(404).json({ errMsg: 'No post found' })
    }
    return res.status(200).json({ data: postPublic })
})

app.listen(port, () => console.log(`App is running on port ${port}`))