const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema =  new Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        recieverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: { type: String },
        image: { type: String }
    },
    { timestamps: true }
)

const message = mongoose.model('Message', messageSchema)
module.exports = message