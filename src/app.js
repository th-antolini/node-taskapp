const db = require('mongoose')
const express = require('express')
const path = require('path')
const routes = require('./routes')
const auth = require('./middleware/auth')

const app = express()
const port = process.env.PORT || 3000
const MongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskapp'

db.connect(MongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

app.use(auth)

app.use(express.json())

app.use('/api', routes)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
