const FriendsInvitation= require('../../models/friendsInvitation')
const friendsUpdate = require('../../socketHandler/updates/friends')
const postReject = async (req,res) => {
    try{

    
    const { id } = req.body
    const { userId } = req.user
    // remove the invitation from from friends colection
    const invitationExists = await FriendsInvitation.exists({_id:id})
    if (invitationExists){
        await FriendsInvitation.findByIdAndDelete(id)
    }
    // update pending Invitation
    friendsUpdate.updateFriendsPendingInvitation(userId)
    return res.status(200).send("Invitation Rejected!!!!!!!")
    }catch(err){
        return res.status(500).send("Something went wrong")
    }
}
module.exports = postReject