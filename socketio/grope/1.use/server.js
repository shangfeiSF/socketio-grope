var fs = require('fs')
var http = require('http')
var util = require('util')
var path = require('path')
var colors = require('colors')
var express = require('express')
var socketio = require('socket.io')

var app = express()
var server = http.Server(app)

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '/index.html'))
})
app.get('/client.js', function (request, response) {
  response.sendFile(path.join(__dirname, '/client.js'))
})

var io = socketio(server)

// 注册的第一个中间件
var written = false
var log = fs.openSync('./log/socket.log', 'w')
io.use(function (socket, next) {
  if (socket) {
    if (!written) {
      fs.writeSync(log, util.inspect(socket, {depth: null}))
      fs.closeSync(log)
      console.log(('[MiddleWare] -- log Object socket to log/socket.log').magenta)
      written = true
    }
    return next()
  }
  next(new Error('none socket'))
})

// 注册的第二个中间件
io.use(function (socket, next) {
  if (socket.request.headers.referer) {
    console.log(('[MiddleWare] -- ' + socket.request.headers.referer).magenta)
    return next()
  }
  next(new Error('none socket.request.headers.referer'))
})

io.on('connection', function (socket) {
  console.log('[Server] -- Greeting after 3 seconds...'.green)

  setTimeout(function () {
    console.log('[Server] -- Emit Greeting...'.green)
    socket.emit('greeting', {
      message: 'Hello, how are you? --' + (new Date().toTimeString())
    })
  }, 3000)

  socket.on('answer', function (data) {
    console.log(('[Client] -- ' + data.message).yellow)
  })
})

server.listen(8080, function () {
  console.log(('[Server] -- Server listen 127.0.0.1:8080...').green)
})