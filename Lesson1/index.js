import http from "http";
import url from "url"
import { listUsers } from "./data.js";
const PORT = 8080;
const app = http.createServer((request, response) => {
  const urlParsed = url.parse(request.url, true)
  const path = urlParsed.pathname
  if (path === '/users') {
    return response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(listUsers))
  }
  if (path === '/users/old') {
    const listUserAboveFifty = listUsers.filter(user => user.age >= 50)
    return listUserAboveFifty.length > 0 ?
      response
        .writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify(listUserAboveFifty))
      : response.writeHead(404).end('User not found')
  }
  if (path === '/users/add-random') {
    const fullName = request.headers.fullname
    const age = request.headers.age
    const className = request.headers.class
    const newListUsers = [...listUsers, { id: crypto.randomUUID(), fullName, age, className }]
    return response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(newListUsers))
  }
  if (path === '/users/add/') {
    const userInfo = urlParsed.query
    listUsers.push({
      id: crypto.randomUUID(),
      fullName: userInfo.fullName,
      age: userInfo.age,
      class: userInfo.class
    })
    return response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(listUsers))
  }
  if (path === '/users/update/') {
    const userInfo = urlParsed.query
    const [user] = listUsers.filter(user => user.id === +userInfo.id)

    if (user.length === 0) {
      return response.writeHead(400, {}).end(`Invalid user id: ${userInfo.id}`)
    }

    if (userInfo.fullName.length !== undefined && userInfo.fullName.length !== null)
      user.fullName = userInfo.fullName

    if (userInfo.age.length !== undefined && userInfo.fullName.age !== null)
      user.age = userInfo.age

    if (userInfo.class.length !== undefined && userInfo.fullName.class !== null)
      user.class = userInfo.class

    return response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(user))
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
