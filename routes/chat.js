const express = require('express');
const router = express.Router();
const {User, Message} = require('./../models/index')
const { Op } = require('sequelize')
const passport = require('passport')
require('./../middleware/passport')()

router.get('/chat', async (req,res)=>{
  const user = await User.findAll()
  res.render('../views/chat.ejs', {
    users : user 
  })
}) 

router.get('/api/chat',passport.authenticate('jwt', {session : false}) , async(req,res)=>{
  const authUser = req.user?.id
  const id = req.query?.id

  if(id) {
  const data = await User.findOne({
    where : {
      id : id 
    } 
  })
  
  const message = await Message.findAll({
    where : {
      sender_id : authUser ,
      reciever_id : id,
    }
  })
  
  return res.send({
    messages : message,
    user : data
  })
  } else {
    return res.send({
      message : 'please select a user'
    })
  }
})


module.exports = router