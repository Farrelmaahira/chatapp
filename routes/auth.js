const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const {User} = require('./../models/index')

require('dotenv').config()



router.get('/', (req,res)=>{
  res.render('../views/login.ejs', { page : 'login.ejs'})
})

router.post('/auth/register', async (req,res)=> {
    const hashedPass = await bcrypt.hash(req.body.password, 10)
    const data = await User.create({
      username : req.body.username,
      email : req.body.email,
      password : hashedPass,
    })
    
    const payload = {
      id : data.id,
      username : data.username,
      email : data.email
    }
    
    const token = jwt.sign(payload, process.env.TOKEN)
    
    res.status(200)
      .send({
        data,
        token : token
      })
})

router.post('/auth/login', async (req,res)=>{
  const data = await User.findOne({ where : { email : req.body.email}})
  
  const validate = await bcrypt.compare(req.body.password, data.password)
  if(validate) {
    const payload = {
      id : data.id,
      username : data.username,
      email : data.email
    } 
    const token = jwt.sign(payload, process.env.TOKEN)
    
    res.send({
      data,
      token : token
    });
    
  } else {
  console.log('password not match')
  }
  
})

router.get('/users', async(req,res)=>{
  const data = await User.findAll()
  res.send({
    data 
  })
})

module.exports = router