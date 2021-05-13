const mongoose = require('mongoose');
const validator = require('validator')

var newfacultySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    }
})

const Newfaculty = new mongoose.model('Newfaculty', newfacultySchema);

module.exports = Newfaculty