const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended: false}))

const server = http.createServer(app)
const port = 8080

const helloWorldRouter = require("./router/helloworld")

server.listen(port, function(){
    console.log(`server running on ${port}`)
})

app.use('/helloworld',helloWorldRouter)