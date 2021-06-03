const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator')
const Faculty = require('./faculty')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        required: 'This field is required.'
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6
    },
    confirmpassword: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{ 
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('faculties',{
    ref: 'Faculty',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {// 'this' keyword is giving the access of database
        this.password = await bcrypt.hash(this.password,8)
        this.confirmpassword = await bcrypt.hash(this.confirmpassword,8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

//we r creating collection here
const Register = new mongoose.model('Register', userSchema)

module.exports = Register