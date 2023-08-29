const express = require('express');
const router = express.Router();
const {User} = require('./../models/index')

router.get('/chat', (req,res)=>{
  res.render('./../views/chat.ejs')
})

router.get('/chat/:id', async (req,res)=>{
  const id = req.params.id
  const data = await User.findOne({
    where : {
      id : id 
    } 
  })
  
  res.send(data)
})

module.exports = router