const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.COUNDINARY_CLOUD_NAME,
    api_key: process.env.COUNDINARY_API_KEY,
    api_secret: process.env.COUNDINARY_API_SECRET
})

module.exports = cloudinary;