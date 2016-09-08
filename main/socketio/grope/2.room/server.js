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

var rooms = [{
  name: 'Earth',
  counts: 0
}, {
  name: 'Mars',
  counts: 0
}]
var index = 0

io.on('connection', function (socket) {
  socket.on('connected', function (data) {
    socket.sign = [data.nickname, data.id].join(' #')
    socket.room_name = rooms[index].name

    socket.join(rooms[index].name)

    rooms[index].counts++
    index = (index + 1) % 2

    console.log(('[Server] -- ' + socket.sign + ' join in room named ' + socket.room_name).yellow)

    var cencus = rooms.map(function(room){
      return room.name + ' @ ' + room.counts
    }).join(',')
    console.log(('[Server] -- ' + cencus).cyan)

    console.log(('[Server] -- ' + socket.sign + ' greeting to everyone in room ' + socket.room_name).magenta)

    socket.emit('join', {
      message: 'You has join in room #' +  socket.room_name
    })

    socket.broadcast.to(socket.room_name).emit('greeting', {
      sign: socket.sign,
      message: 'Hello erveryone. I am ' + socket.sign
    })
  })

  socket.on('answer', function(data){
    socket.broadcast.to(socket.room_name).emit('broadcast', {
      message: socket.sign + '：' + data.message
    })
  })

  socket.on('disconnect', function () {
    rooms.forEach(function(room){
      if(room.name === socket.room_name){
        room.counts --
      }
    })
    socket.leave(socket.room_name)

    console.log(('[Server] -- ' + socket.sign + ' leave room named ' + socket.room).yellow)
    var cencus = rooms.map(function(room){
      return room.name + ' @ ' + room.counts
    }).join(',')
    console.log(('[Server] -- ' + cencus).cyan)

    socket.broadcast.to(socket.room_name).emit('greeting', {
      message: 'Goodbye erveryone. I am ' + socket.sign
    })
  })
})

server.listen(8080, function () {
  console.log(('[Server] -- Server listen 127.0.0.1:8080...').green)
})