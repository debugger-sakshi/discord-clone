const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authController')
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({});
const auth = require('../middleware/auth')
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(10).required(),
    password: Joi.string().min(4).max(10).required(),
    email:Joi.string().email().required()
})

const loginSchema = Joi.object({
  
    password: Joi.string().min(4).max(10).required(),
    email:Joi.string().email().required()
})


router.post('/register', validator.body(registerSchema),authControllers.controllers.postRegister)

router.post('/login',validator.body(loginSchema), authControllers.controllers.postLogin)
// test route if middleware is working 
router.get('/test',auth,(req,res)=>{
    res.send('request passed');
})
module.exports = router;