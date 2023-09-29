const express = require('express');
const router = express.Router();
const {User, Message} = require('./../models/index')
const { Op } = require('sequelize')
const passport = require('passport')
require('./../middleware/passport')()

router.get('/chat',  async (req,res)=>{
  res.render('../views/chat.ejs')
}) 

router.get('/api/users', passport.authenticate('jwt', {session : false}), async(req,res)=>{
  const userId = req.user?.id
  const users = await User.findAll({
    where : {
      id : {
        [Op.ne] : userId 
      } 
    }
  })
  
  res.send(users)
})

router.get('/api/chat',passport.authenticate('jwt', {session : false}) , async(req,res)=>{
  const authUserId = req.user?.id
  const id = req.query?.id

  if(id) {
  const data = await User.findOne({
    where : {
      id : id 
    } 
  })
  
  const message = await Message.findAll({
    where : {
      [Op.or] : [{sender_id : authUserId, reciever_id : id},{sender_id : id, reciever_id : authUserId}]
    },
    include : {
      model : User,
      as : 'user'
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