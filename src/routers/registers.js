const express = require('express')
const Register = require('../models/registers')
const router = new express.Router()
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const facultyRouter = require('./faculty')
const hbs = require('hbs')

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'confirmpassword':
                body['confirmpasswordError'] = err.errors[field].message; 
                break;   
            case 'password':
                body['passwordError'] = err.errors[field].message;    
                break;
            default:
                break;
        }
    }
}

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {

        if (req.body.password !== req.body.confirmpassword) {
            return res.render('register', {
                user: req.body,
                message: 'Password not matching'
            })
        }
        
        if (req.body.email) {
        const registeredEmail = await facultyRouter.Newfaculty.findOne({ email: req.body.email })
        if (!registeredEmail) {
            return res.render('register', {
                user: req.body,
                message: 'you maybe a new faculty here, please contact to existing faculty to register yourself'
            })
        }
    }

        const registerUser = new Register(req.body)
        const token = await registerUser.generateAuthToken()
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true
        })

        await registerUser.save()
        res.redirect('/faculty/list')
    } catch (err) {
        if (err.name == 'ValidationError') {
            handleValidationError(err, req.body);
            res.render('register', {
            user: req.body
           })
        }   
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    try {
        const user = await Register.findOne({ email: req.body.email })

        const isMatch = await bcrypt.compare(req.body.password, user.password)

        if (!isMatch) {
            throw new Error()
        }

        const token = await user.generateAuthToken()
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: true,
            // secure: true //only store cookie for https server not for http 
        })

        res.redirect('/faculty/list')
    } catch (e) {
        res.render('login', { message: 'Invalid login details' })
    }
})

router.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => currElement.token !== req.token)
        res.clearCookie('jwt')
        console.log('logout successful')

        await req.user.save()
        res.redirect('/')
    } catch (e) {
        console.log('Error in logout :' + e);
    }
})


module.exports = router