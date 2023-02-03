const  User = require('../../models/user');
const FriendsInvitation = require('../../models/friendsInvitation');
const serverStore = require('../../serverStore')

const updateFriendsPendingInvitation = async (userId) => {
    try{
        const pendingInvitation = await FriendsInvitation.find({
            receiverId: userId
        }).populate('senderId','_id username email')

        // find all active user
        const receiverList = serverStore.getActiveConnection(userId)
        const io = serverStore.getSocketServerInstance()
        // console.log("receiver list",receiverList)
        receiverList.forEach(receieverSocketId => {
            console.log(receieverSocketId)
            io.to(receieverSocketId).emit('friends-invitations',{
                pendingInvitation: pendingInvitation ? pendingInvitation:[]
            })
        });
    }catch(err){
        console.log(err)
    }
}

const updateFriends = async (userId) => {
    try{
        // find active user by specific id
        const recieverList = serverStore.getActiveConnection(userId)
        if (recieverList.length > 0){
            const user = await User.findById(userId,{_id:1, friends:1}).populate(
                'friends',
                '_id username email'
            )
            if (user){
                const friendsList = user.friends.map(f =>{
                    return {
                        id:f._id,
                        email:f.email,
                        username: f.username
                    }
                })
            

                //get io instance
                const io = serverStore.getSocketServerInstance()
                recieverList.forEach((receieverSocketId)=>{
                    io.to(receieverSocketId).emit("friends-list",{
                        friends: friendsList? friendsList:[],
                    })
                })
            }

        }
    }catch(err){
        console.log(err)
    }
}

module.exports  = {updateFriendsPendingInvitation,updateFriends}