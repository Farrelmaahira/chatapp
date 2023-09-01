const express = require('express')

const app = express()

const http = require('http')

const server = http.createServer(app)

const bodyParser = require('body-parser')

const authRoutes = require('./routes/auth')

const chatRoutes = require('./routes/chat')

const cors = require('cors')

const { Server } = require('socket.io')

const jwt = require('jsonwebtoken')

const { User, Message } = require('./models/index')

const path = require('path')

const passport = require('passport')

require('dotenv').config()

app.set('view engine', 'ejs')

app.use(
  '/css',
  express.static(
    path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')
  )
)
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js/'))
)
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/jquery/dist/'))
)
app.use(express.static(path.join(__dirname, 'views/partials/style.css')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize())

app.use(authRoutes)
app.use(chatRoutes)

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.TOKEN,
      (err, decoded) => {
        if (err) return next(new Error('Authentication error'))
        socket.decoded = decoded
        next()
      }
    )
  } else {
    next(new Error('Authentication error'))
  }
}).on('connection', async (socket) => {
  await User.update(
    { socketId: socket.id },
    { where: { id: socket.decoded.id } }
  )
  console.log(socket.decoded)
  console.log('connected with ' + socket.id + socket.decoded.id)

  socket.on('sendmessage', async (data) => {
    console.log(data)
    await Message.create({
      sender_id: socket.decoded.id,
      reciever_id: data.to,
      message: data.message,
    })
    const recieverUser = await User.findOne({ where: { id: data.to } })
    const message = await Message.findOne({
      where: {
        reciever_id: recieverUser.id,
      },
      order: [['createdAt', 'DESC']],
      include : {
        model : User,
        as : 'user'
      }
    })
    socket.to(recieverUser.socketId).emit('messages', { data: message.message, from : message.user })
  })

  socket.on('disconnect', async (reason, details) => {
    console.log(`disconnected with ${socket.decoded.email}`)
    const userId = socket.decoded.id
    await User.update({ socketId: null }, { where: { id: userId } })
  })
})

server.listen(process.env.PORT, function () {
  console.log('running')
})
