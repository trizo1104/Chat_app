const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        password: { type: String, required: true, minlength: 6 },
        profilePic: { type: String, default: '' }
    },
    { timestamps: true }
)

const user = mongoose.model('User', userSchema)
module.exports = user

