const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    paticipants: [
        {
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "Message"
        }
    ]
})

module.exports = mongoose.model("Conversation", conversationSchema)