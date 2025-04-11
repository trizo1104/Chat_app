const express = require('express')
const authController = require('../controllers/auth.controller')
const protectRoute = require('../middleware/auth.middleware')
const authRouter = express.Router()

authRouter.post('/signup', authController.signup)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)

authRouter.put('/update-profile', protectRoute, authController.updateProfile)

authRouter.get('/check', protectRoute, authController.checkAuth)

module.exports = authRouter