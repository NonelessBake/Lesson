const users = [
    {
        id: "9fceb585-042f-4f10-9cb5-37c529d93166",
        userName: "Nobita",
        email: "nobita@japanese.com",
        age: 5,
        avatar: "https://i.kym-cdn.com/photos/images/original/000/985/256/d51.png"
    },
    {
        id: "6257644e-94f2-45fc-9803-fc862df55eaa",
        userName: "Doraemon",
        email: "doraemon@nobita.com",
        avatar: "https://i.pinimg.com/736x/11/e4/4d/11e44d85743b28fa62121b5ae71a914b.jpg"
    },
    {
        id: "e7a88219-c265-44b4-ba02-1d2571ee4173",
        userName: "Suneo",
        email: "suneo@jaien.com",
        avatar: "https://ecdn.game4v.com/g4v-content/uploads/2023/05/19100155/Suneo-2-game4v-1684465314-94.jpg"
    }
];
// const { userName, email, age, avatar } = req.body
let findIndex = users.findIndex(user =>
    user.userName === 'Suneo' || user.email === "doraemon@nobita.com")
const arr = [1, 2, 3, 4, 5, 6, 7, 8]
console.log(arr.filter(item => item > 2))
const date = new Date()
console.log(date)

const t = { a: 1, b: 2 }
const { a, b, c } = t
console.log(a, b, c)
const content = 'Chúc mọi người cuối tuần vui vẻ'

const strNormalize = (str) => str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()

const test = [{
    userId: '9fceb585-042f-4f10-9cb5-37c529d93166',
    postId: '40b8d24e-70a5-4f75-8f71-0905b8e197cf',
    content: 'Yêu mọi người!',
    createdAt: '2023-09-22T12:34:00.000Z',
    isPublic: true
},
{
    userId: '9fceb585-042f-4f10-9cb5-37c529d93166',
    postId: '3b8d6e1a-7601-43c3-9264-1f3653a1e5c9',
    content: 'Chúc mọi người cuối tuần vui vẻ!',
    createdAt: '2023-09-22T12:35:00.000Z',
    isPublic: true
},
{
    userId: '9fceb585-042f-4f10-9cb5-37c529d93166',
    postId: '5f508d8e-407b-4b41-8ff2-e727590aaf5d',
    content: 'Làm điều tốt cho ngày hôm nay!',
    createdAt: '2023-09-22T12:36:00.000Z',
    isPublic: true
},]
const keyword = 'mọi người'
const findPosts = test.filter(post => strNormalize(post.content).includes(strNormalize(keyword))

)
console.log(findPosts)