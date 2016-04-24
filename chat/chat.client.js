function ChatClient() {
  this.maps = [
    {
      alias: 'username',
      id: 'username'
    }, {
      alias: 'content',
      id: 'content'
    }, {
      alias: 'message',
      id: 'message'
    }, {
      alias: 'loginbox',
      id: 'loginbox'
    }, {
      alias: 'chatbox',
      id: 'chatbox'
    }, {
      alias: 'showusername',
      id: 'showusername'
    }, {
      alias: 'census',
      id: 'onlinecount'
    }, {
      alias: 'register',
      id: 'register'
    }, {
      alias: 'postcontent',
      id: 'postcontent'
    }, {
      alias: 'logout',
      id: 'logout'
    }
  ]
  this.nodes = {}

  this.userId = null
  this.userName = null

  this.remote = 'http://127.0.0.1:3000'
  this.socket = null

  this.init()
  this.bind()
}

ChatClient.prototype.init = function () {
  var self = this
  this.maps.forEach(function (map) {
    self.nodes[map.alias] = document.getElementById(map.id)
  })
}

ChatClient.prototype.bind = function () {
  var self = this

  self.nodes.username.onkeydown = function (e) {
    e = e || event
    e.keyCode === 13 && self.register()
  }

  self.nodes.content.onkeydown = function (e) {
    e = e || event
    e.keyCode === 13 && self.postContent()
  }

  self.nodes.register.onclick = function () {
    self.register()
  }

  self.nodes.postcontent.onclick = function () {
    self.postContent()
  }

  self.nodes.logout.onclick = function () {
    self.logout()
  }
}

ChatClient.prototype.generateUserId = function () {
  return new Date().getTime() + '-' + Math.floor(Math.random() * 197)
}

ChatClient.prototype.attachBottom = function () {
  window.scrollTo(0, this.nodes.message.clientHeight)
}

ChatClient.prototype.postContent = function () {
  var self = this
  var content = self.nodes.content.value

  if (content.length == 0) return false

  self.socket.emit('message', {
    userId: self.userId,
    userName: self.userName,
    content: content
  })

  self.nodes.content.value = ''
}

ChatClient.prototype.register = function () {
  var self = this
  var userName = self.nodes.username.value
  if (userName.length == 0) return false

  self.nodes.username.value = ''
  self.nodes.loginbox.style.display = 'none'
  self.nodes.chatbox.style.display = 'block'

  self.connect(userName)
}

ChatClient.prototype.connect = function (userName) {
  var self = this

  self.userId = this.generateUserId()
  self.userName = userName

  self.nodes.showusername.innerHTML = userName
  self.nodes.message.style.minHeight = (window.innerHeight - document.body.clientHeight + self.nodes.message.clientHeight) + 'px'
  self.attachBottom()

  self.tcp()
}

ChatClient.prototype.tcp = function () {
  var self = this
  self.socket = io.connect(self.remote)

  self.socket.emit('login', {
    userId: self.userId,
    userName: self.userName
  })

  self.socket.on('login', function (data) {
    self.update('login', data)
  })

  self.socket.on('logout', function (data) {
    self.update('logout', data)
  })

  self.socket.on('message', function (data) {
    var isme = (data.userId == self.userId) ? true : false

    var contentDom = '<div>' + data.content + '</div>'
    var userNameDom = '<span>' + data.userName + '</span>'

    var section = document.createElement('section')

    if (isme) {
      section.className = 'user'
      section.innerHTML = contentDom + userNameDom
    } else {
      section.className = 'service'
      section.innerHTML = userNameDom + contentDom
    }

    self.nodes.message.appendChild(section)
    self.attachBottom()
  })
}

ChatClient.prototype.update = function (message, data) {
  var self = this

  var usersOnline = data.usersOnline
  var countOnline = data.countOnline
  var user = data.user

  var userNames = []
  usersOnline.forEach(function (user) {
    userNames.push(user.userName)
  })
  self.nodes.census.innerHTML = ['当前共有', countOnline, '人在线，在线列表：', userNames.join('、')].join('')

  var tips = '<div class="msg-system">' + user.userName
  tips += (message == 'login') ? ' 加入了聊天室' : ' 退出了聊天室' + '</div>'

  var section = document.createElement('section')
  section.className = 'system J-mjrlinkWrap J-cutMsg'
  section.innerHTML = tips

  self.nodes.message.appendChild(section)
  self.attachBottom()
}

ChatClient.prototype.logout = function () {
  this.socket.disconnect()
  location.reload()
}

window.chatClient = new ChatClient()