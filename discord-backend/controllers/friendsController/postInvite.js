const User = require('../../models/user')
const Invitation = require('../../models/friendsInvitation')
const friendsUpdate = require('../../socketHandler/updates/friends')
const postInvite = async(req,res) => {
    const {targetMailAddress} = req.body
    const {userId, email} = req.user

    if (email.toLowerCase() == targetMailAddress.toLowerCase()){
        return res.status(409).send("You cannot become friend with yourself")
    }
    const targetUser = await User.findOne({email:targetMailAddress.toLowerCase()})
    console.log(targetUser)

    if (!targetUser){
        return res.status(404).send(`Friend ${targetMailAddress} is not found. PLease check email address`)
    }
    //check if invitation is already sent

    const invitationAlreadyReceived = await Invitation.findOne({
        senderId: userId ,
        receiverId: targetUser._id
    });

    if (invitationAlreadyReceived){
        return res.status(409).send("Invitation has already been send")
    }

    //check if user already be our friend
    const userAlreadyFriend = targetUser.friends.find((friendId)=>{
        friendId.toString()  === userId.toString()
    })
    if (userAlreadyFriend){
        return res.status(409).send("Friend already exists.")
    }

    // create new invitation in database
    const newInvitation = await Invitation.create({
        senderId: userId,
        receiverId: targetUser._id
    })
    // if invitation successfully created we would like to update friend
    //send pending invitationupdate to speific user
    
    friendsUpdate.updateFriendsPendingInvitation(targetUser._id.toString())
    return res.status(201).send("Invitation has been sent")
}

module.exports = postInvite