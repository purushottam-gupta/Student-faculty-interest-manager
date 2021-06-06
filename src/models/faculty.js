const mongoose = require('mongoose');
const validator = require('validator')
const registers = require('./registers')

var facultySchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.',
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        required: 'This field is required.',
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    },
    entry: {
        type: Number,
        required: 'This field is required.'
    },
    entryAccepted: {
        type: Number,
        required: 'This field is required.'
    },
    fieldOfInterest: {
        type: String,
        required: 'This field is required.',
        trim: true
    },
    avatar: {
        type: String
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    }
});

const Faculty = new mongoose.model('Faculty', facultySchema);

module.exports = Faculty