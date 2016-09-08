var chat = io.connect('http://localhost:8080/chat')
var news = io.connect('http://localhost:8080/news')
var greetings = document.getElementById('greetings')

var sign = +new Date()

chat.on('connect', function () {
  chat.emit('connected', {
    sign: sign
  })
})

chat.on('join', function (data) {
  var message = document.createElement('div')
  message.innerHTML = data.message
  message.style.color = '#00ff00'
  greetings.appendChild(message)
})

chat.on('self', function (data) {
  var message = document.createElement('div')
  message.innerHTML = data.message
  greetings.appendChild(message)

  chat.emit('answer', {
    message: 'Thank you'
  })
})

news.on('connect', function () {
  news.emit('connected', {
    sign: sign
  })
})

news.on('push', function (data) {
  var n = document.createElement('div')
  n.innerHTML = 'NEWS--' + data.news
  n.style.color = '#00ffff'
  greetings.appendChild(n)

  news.emit('received', {
    message: 'Thank you for sending ' + data.news
  })
})