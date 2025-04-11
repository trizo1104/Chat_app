const express = require('express')
const messageController = require('../controllers/message.controller')
const protectRoute = require('../middleware/auth.middleware')
const messageRoute = express.Router()

messageRoute.get('/user', protectRoute, messageController.getUserForSideBar)
messageRoute.get('/:id', protectRoute, messageController.getMessage)
messageRoute.post('/send/:id', protectRoute, messageController.sendMessage)


module.exports = messageRoute