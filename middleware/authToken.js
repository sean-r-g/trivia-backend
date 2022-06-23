const jwt = require('jsonwebtoken')
require('dotenv').config()

const authToken = async (req, res, next) => {
    const token = req.header('x-auth-token')
    try {
        const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = user.email
        next()
    } catch (error) {
        console.log(error);
    }
}

module.exports = authToken