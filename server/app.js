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

mongoose
    .set('strictQuery', true)
    .connect(mongodb)
    .then(() => console.log('connected to db'))
    .catch(err => console.log(err))

let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}

app.listen(port, () => {
    console.log(`running on port ${port}`)
})