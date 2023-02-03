const jwt = require('jsonwebtoken');

const config = process.env

const verifyTokenSocket = (socket,next) =>{
    console.log("vtS")
    const token = socket.handshake.auth?.token;

    try{
        const decoded = jwt.verify(token,config.TOKEN_KEY)
        socket.user = decoded
        // console.log("socket is ", socket)
    }catch(err){
        const socketError = new Error("Not Authorized");
        return next(socketError)

    }
    next()
}

module.exports = verifyTokenSocket