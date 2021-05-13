const mongoose = require('mongoose');
const validator = require('validator')

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
    fieldOfInterest: {
        type: String,
        required: 'This field is required.',
        trim: true
    }
});

const Faculty = new mongoose.model('Faculty', facultySchema);

module.exports = Faculty