const mongoose = require('mongoose')

const connectDB = () => {
    const urlDB = process.env.DB_URL
    const connectDB = mongoose.connect(urlDB)
    connectDB.then(() => {
        console.log('connect DB success')
    })
}

module.exports = connectDB