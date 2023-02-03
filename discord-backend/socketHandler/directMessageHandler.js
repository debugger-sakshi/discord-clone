const Conversation = require("../models/conversation");

const directMessageHandler = async (socket,data) => {
    try{
        const { userId} = socket.user
        const { receiverId, content} = data
        // create new message
        const message = await Messsage.create({
            content:content,
            authorId:userId,
            date: new Date(),
            type: "DIRECT"
        });

        //find if conversation exist with this two users - if not create new

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, receiverId]}
        })

        if (conversation){
            conversation.messages.push(message._id)
            await conversation.save()
        }
        else{
            //create new conversation
            const newConversation = await Conversation.create({
            messages: [message._id],
            participants:[userId, receiverId]
            })
        }

    }catch(err){
        console.log(err)
    }
}

module.exports = directMessageHandler