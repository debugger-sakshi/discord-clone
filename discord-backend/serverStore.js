const connectedUser  = new Map()

let io = null;

 const setSocketServerInstance = (ioInstance)=>{
    io = ioInstance;
}

 const getSocketServerInstance = () =>{
    return io;
}

const addNewConnectedUser = ({socketId,userId}) =>{
    connectedUser.set(socketId,{userId})
    console.log("new user Connected")
    console.log(connectedUser)
}

const removeConnectedUser = (socketId) =>{
    if (connectedUser.has(socketId)){
        connectedUser.delete(socketId)
        console.log("new connected user");
        console.log(connectedUser)
    }
}

const getActiveConnection = (userId) =>{
    const activeConnections = [];

    connectedUser.forEach(function (value,key) {
        if(value.userId === userId){
            activeConnections.push(key)
        }
    })
    console.log("Active conection", activeConnections)
    return activeConnections
}

const getOnlineUsers = () =>{
    const onlineUsers = [];

    connectedUser.forEach(function (value,key) {
        onlineUsers.push({socketId: key, userId: value.userId})
    })
    
    return onlineUsers
}

module.exports = {addNewConnectedUser,removeConnectedUser,getActiveConnection ,setSocketServerInstance,getSocketServerInstance,getOnlineUsers}