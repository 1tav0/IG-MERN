const express = require('express')
const mongoose = require('mongoose')
const app = express()
const { mongodb } = require('./keys')
const User = require('./models/User')
const Post = require('./models/Post')

const AuthRoutes = require('./routes/auth')
const PostRoutes = require('./routes/post')
const UserRoutes = require('./routes/user')
//middleware
app.use(express.json()) //placing matters
app.use(AuthRoutes)
app.use(PostRoutes)
app.use(UserRoutes)

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
    PORT = 5000
}

mongoose
    .set('strictQuery', true)
    .connect(mongodb)
    .then(() => console.log('connected to db'))
    .catch(err => console.log(err))

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})