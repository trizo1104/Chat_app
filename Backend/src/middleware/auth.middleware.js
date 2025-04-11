const jwt = require('jsonwebtoken')
const User = require('../models/user.model')


const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) return res.status(401).json({ mess: 'Unathorized - No token provided' })

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if (!decode) return res.status(401).json({ mess: 'Unathorized - Invalid token' })

        const user = await User.findById(decode.userId).select("-password")
        if (!user) return res.status(400).json({ mess: "User not found" })

        req.user = user

        next()
    } catch (error) {
        return res.status(500).json({ mess: 'Internal server' })
    }
}

module.exports = protectRoute

