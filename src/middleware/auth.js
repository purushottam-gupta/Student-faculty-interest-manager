const jwt = require('jsonwebtoken');
const Register = require('../models/registers')

const auth = async (req, res, next) => {
    try {

    const token = req.cookies.jwt
    const verifyUser = await jwt.verify(token, process.env.SECRET_KEY)// this will give the id of login token
    const user = await Register.findOne({ _id: verifyUser._id })

    req.token = token
    req.user = user

    next()
    
    } catch (err) {
        res.redirect('/login')
    }
}

module.exports = auth