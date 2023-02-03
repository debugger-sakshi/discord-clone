const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postRegister = async (req,res) => {
    
    try{
        let {username, email, password } = req.body
        //check if user exists

        const userExists = await User.exists({email:email.toLowerCase()})
        // console.log(userExists)
        if (userExists){
            return res.status(409).send("Email is already exist")
        }
        else{
            const encryptedPassword = await bcrypt.hash(password,10)
            //create user object and save in db
            const user = await User.create({
                username,
                email:email.toLowerCase(),
                password: encryptedPassword
            })
            // console.log(user)
            //create JWT token
            const token = jwt.sign(
                {
                    userId: user._id,
                    email
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h'
                },
            )
            return res.status(201).json({
                userDetails:{
                    email: user.email,
                    uername: user.username,
                    token:token
                }
            })
        }
        
    }
    catch(err){
        console.log(err);
        return res.status(500).send("An error occured. PLease try again....")
    }
}

module.exports = postRegister