const FriendsInvitation= require('../../models/friendsInvitation')
const friendsUpdate = require('../../socketHandler/updates/friends')

const User = require('../../models/user')
const postAccept = async (req,res) => {
    try{
        const { id } = req.body
       

        const invitation = await FriendsInvitation.findById(id)
        if(!invitation){
            return res.status(401).send("Error occured!!, Please try again")
        }
        
        const { senderId, receiverId } = invitation
        console.log(senderId, receiverId)
        // add friends to both user
        const senderUser = await User.findById(senderId)
        senderUser.friends = [...senderUser.friends, receiverId]

        const recieverUser = await User.findById(receiverId)
        recieverUser.friends = [...recieverUser.friends, senderId]

        await senderUser.save()
        await recieverUser.save()

        //delete invitation
        const invitationExists = await FriendsInvitation.exists({_id:id})
        if (invitationExists){
            await FriendsInvitation.findByIdAndDelete(id)
        }
        // update list of friemds if user are on;ine
        friendsUpdate.updateFriends(senderId.toString())
        friendsUpdate.updateFriends(receiverId.toString())
        //update list of friends pending invitation
        friendsUpdate.updateFriendsPendingInvitation(receiverId.toString())
        return res.status(200).send('Friends Successfully added..')


    }catch(err){
        console.log(err)
        return res.status(500).send('Something went wrong. Please try after sometime')
    }
    

    
}
module.exports = postAccept