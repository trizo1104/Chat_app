const { genrateToken } = require('../lib/utils')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const cloudinary = require('../lib/cloundinary')

const signup = async (req, res) => {
    const { email, fullName, password } = req.body
    try {
        const checkEmailExist = await User.findOne({ email })
        if (checkEmailExist) return res.status(400).json({ mess: "Email is already exist" })

        if (password.length < 6) {
            return res.status(400).json({ mess: "password at least 6 characters" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            fullName,
            password: hashPass
        })

        if (newUser) {
            genrateToken(newUser._id, res)
            await newUser.save()

            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }

    } catch (error) {
        console.log('signup error: ', error)
        return res.status(500).json({ mess: 'Internal server' })
    }
}


const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ mess: 'Email or Password is wrong!' })

        const checkPass = await bcrypt.compare(password, user.password)
        if (!checkPass) {
            return res.status(400).json({ mess: 'Email or Password is wrong!' })
        }

        genrateToken(user._id, res)

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("login error: ", error)
        return res.status(500).json({ mess: 'Internal server' })
    }
}

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        return res.status(200).json({ mess: 'Logout successfully!' })
    } catch (error) {
        console.log("logout error: ", error)
        return res.status(500).json({ mess: 'Internal server' })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id

        if (!profilePic) return res.status(400).json({ mess: "Profile is required" })

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        if (!uploadResponse.secure_url) {
            return res.status(500).json({ mess: "Failed to upload image to Cloudinary" });
        }

        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        if (!updateUser) {
            return res.status(404).json({ mess: "User not found" });
        }


        return res.status(200).json({ updateUser })
    } catch (error) {
        console.log("update-profile error: ", error)
        return res.status(500).json({ mess: 'Internal server' })
    }
}

const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user)

    } catch (error) {
        console.log("check auth error: ", error)
        return res.status(500).json({ mess: 'Internal server' })
    }
}

module.exports = { signup, login, logout, updateProfile, checkAuth }