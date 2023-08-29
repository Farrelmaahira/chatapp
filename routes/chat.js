const express = require('express');
const router = express.Router();

router.get('/chat', (req,res)=>{
  res.render('./../views/chat.ejs')
})

module.exports = router