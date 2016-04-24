var http = require('http')
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

var timeout = null

io.on('connection', function (socket) {
  socket.on('connected', function (data) {
    socket.sign = data.sign

    console.log('[Server] -- ' + 'send server time interval 3 seconds...'.green)

    timeout = setInterval(function () {
      socket.send('Server Time is ' + new Date().getTime())
    }, 3000)
  })

  socket.on('message', function (message) {
    console.log('[Server] -- ' + message.yellow)
  })

  socket.on('disconnect', function () {
    clearInterval(timeout)
    console.log('[Server] -- ' + 'disconnect'.red)
  })
})

server.listen(8080, function () {
  console.log('[Server] -- ' + 'Server listen 127.0.0.1:8080...'.green)
})