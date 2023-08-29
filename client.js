const {io} = require('socket.io-client')

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJmYXJyZWxtYWFoaXJhIiwiZW1haWwiOiJmYXJyZWxAZ21haWwuY29tIiwiaWF0IjoxNjkzMjA3MzQ3fQ.Cx9PxdGCymsy_zC8VdzbQtU6knZoR-eIlpvMdRg9N_Y'

const socket = io('http://localhost:3002', {
  query : {
    token : TOKEN
  }
})

socket.on('messages', (data)=>{
  console.log(data)
})

// socket.emit('sendmessage', {
//   to : 2,
//   message : 'hello'
// });
