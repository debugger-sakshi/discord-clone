const authSocket = require('./middleware/authSocket')
const disconnectHandler = require('./socketHandler/disconnectHandler')
const newConnectionHandler = require('./socketHandler/newConnectionHnadler')
const serverStore = require('./serverStore')
const directMessageHandler = require('./socketHandler/directMessageHandler')
const registerSocketServer = (server) => {
    // console.log("rss")
    const io = require('socket.io')(server,{
        cors:{
            origin:"*",
            methods:["GET","POST"]
        }
    })
    serverStore.setSocketServerInstance(io)

    // get all online user and broadcast
    const emitOnlineUser = () => {
        const onlineUsers = serverStore.getOnlineUsers()
        io.emit('online-users',{ onlineUsers})
    }

    io.use((socket,next)=>{
        authSocket(socket,next)
    })
    io.on("connection",(socket) =>{
        // console.log("user connected");
        // console.log(socket.id)
        //new connection 
        newConnectionHandler(socket,io)
        emitOnlineUser()

        socket.on('direct-message',(data) =>{
            directMessageHandler(socket,data)
        })

        socket.on("disconnect",()=>{
            disconnectHandler(socket)
        })
    })

    setInterval(()=>{
        emitOnlineUser()
    }),[8000]
}

module.exports = {
    registerSocketServer,
}