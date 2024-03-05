const generateID = (arr) => {
    const id = 'US' + Math.floor(Math.random() * 10000)
    const duplicateID = arr.findIndex(ele => ele.id === id)
    if (duplicateID !== -1) {
        generateID()
    }
    return id
}
const users = [
    {
        id: "US001",
        userName: "MindX"
    },
    {
        id: "US002",
        useName: "Nobi Nobita"
    }
]
console.log(generateID(users))