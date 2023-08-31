const {io} = require('socket.io-client')

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJmYXJyZWxtYWFoaXJhIiwiZW1haWwiOiJmYXJyZWwyQGdtYWlsLmNvbSIsImlhdCI6MTY5MzIxMzA4Mn0.KMJraxg3ftNeDqHVfArB_NueciOkvrC8KLb-qud_AHk'

const socket = io('http://localhost:3002', {
  query : {
    token : TOKEN 
  }
})

// socket.emit('sendmessage', {
//   to : 1,
//   message : 'hello juga'
// })
// socket.on('messages', (data)=>{
//   console.log(data)
// })

console.log(process.env.PORT)
