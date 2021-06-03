const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Faculty = require('../models/faculty')
const Newfaculty = require('../models/newfaculty')
const Register = require('../models/registers')
const sendWelcomeEmail = require('../emails/account')
const multer = require('multer')
const path = require('path');

router.post('/newfaculty',auth, async (req, res) => {
    try {
        const newfaculty = new Newfaculty()
        newfaculty.email = req.body.email

        await newfaculty.save()
        res.redirect('/faculty/list')
    } catch (err) {
        res.redirect('/faculty/list')
    }
})

var Storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: Storage,
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb('Please upload an image and it should be of size <3mb')
        }
        cb(undefined, true)
    }
}).single('avatar')

router.get('/faculty', auth, (req, res) => {
    res.render("faculty/addOrEdit", {
        viewTitle: "Insert Faculty"
    });
});

router.post('/faculty', auth, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render("faculty/addOrEdit", {
                viewTitle: "Insert Faculty",
                error: err
            });
        }
        else{
            if (req.body._id == '')
                insertRecord(req, res);
            else
                updateRecord(req, res);
        }
    })
});


async function insertRecord(req, res) {
    try {
        var faculty = await Faculty.findOne({
            fullname: req.body.fullname,
            email: req.body.email,
            entry: req.body.entry,
            fieldOfInterest: req.body.fieldOfInterest
        })

        if (!faculty) {
            throw new Error()
        }
        res.render("faculty/addOrEdit", {
            viewTitle: "Insert Faculty",
            faculty: req.body,
            message: "User already exist"
        });
    } catch (err) {
        try {
            var faculty = new Faculty();
            faculty.fullName = req.body.fullName;
            faculty.email = req.body.email;
            faculty.entry = req.body.entry;
            faculty.fieldOfInterest = req.body.fieldOfInterest;
            if(req.file) faculty.avatar = req.file.filename;
            faculty.owner= req.user._id

            await faculty.save();
            res.redirect('faculty/list');
        } catch (err) {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("faculty/addOrEdit", {
                    viewTitle: "Insert Faculty",
                    faculty: req.body
                });
            }
            else
            console.log(err);
                res.render("faculty/addOrEdit", {
                    viewTitle: "Insert Faculty",
                    faculty: req.body,
                    message: 'Email already been used or some unwanted error'
                });
        }
    }
}

async function updateRecord(req, res) {
    try {
        if (req.file) {
            var data = {
                fullName: req.body.fullName,
                email: req.body.email,
                entry: req.body.entry,
                fieldOfInterest: req.body.fieldOfInterest,
                avatar: req.file.filename
            }
        } else {
            var data = {
                fullName: req.body.fullName,
                email: req.body.email,
                entry: req.body.entry,
                fieldOfInterest: req.body.fieldOfInterest
            }
        }

        await Faculty.findOneAndUpdate({ _id: req.body._id}, data, { new: true })
        res.redirect('/faculty/list')
    } catch (err) {
        if (err.name == 'ValidationError') {
            handleValidationError(err, req.body);
            res.render("faculty/addOrEdit", {
                viewTitle: 'Update Faculty',
                faculty: req.body
            });
        }
        else
            console.log('Error during record update : ' + err);
    }
}

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'fieldOfInterest':
                body['fieldOfInterestError'] = err.errors[field].message;
                break;
            case 'entry':
                body['entryError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/faculty/list', auth, async (req, res) => {
    try {
        const docs = await Faculty.find({})
        res.render("faculty/list", {
            list: docs,
            display: 'd-inline',
            disnone: 'd-none'
        });
    }
    catch (err) {
        res.render("faculty/list", {
            message: 'Error in retrieving faculty list'
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const docs = await Faculty.find({})
        res.render("faculty/list", {
            list: docs
        });
    }
    catch (err) {
        res.render("faculty/list", {
            message: 'Error in retrieving faculty list'
        });
    }
});

router.get('/faculty/:id', auth, async (req, res) => {
    try{
    const doc = await Faculty.findOne({ _id: req.params.id, owner: req.user._id })
    if (!doc) {
        throw new Error()
    }
    res.render("faculty/addOrEdit", {
        viewTitle: "Update Faculty",
        faculty: doc
    });
} catch (err) {
    res.redirect('/faculty/list')
}
});

router.get('/faculty/delete/:id', auth, async (req, res) => {
    try {
        const doc = await Faculty.findOneAndDelete({ _id: req.params.id , owner: req.user._id})
        if (!doc) {
            throw new Error()
        }
        res.redirect('/faculty/list')
        console.log('check')
    } catch (err) {
        res.redirect('/faculty/list')
    }
});

router.post('/:id', async (req, res) => {
    try {
        const doc = await Faculty.findByIdAndUpdate({ _id: req.params.id }, { $inc: { entry: -1 } }, { new: true })
        sendWelcomeEmail(doc.email, req.body.email, req.body.name, req.body.year, req.body.branch, req.body.clgName, req.body.purpose)
        res.redirect('/')
    } catch (err) {
        res.redirect('/')
    }
});


module.exports = { router, Newfaculty };