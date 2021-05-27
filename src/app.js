require('dotenv').config();
const express = require('express')
require('./db/db');
const path = require('path');
const hbs = require('hbs')
const cookieParser = require('cookie-parser');
const registerRouter = require('./routers/registers')
const facultyRouter = require('./routers/faculty')

const app = express()
const port = process.env.PORT || 3000

const publicDir = path.join(__dirname, '../public')
const views_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(registerRouter)
app.use(facultyRouter.router)

app.use(express.static(publicDir))
app.set('view engine', 'hbs')
app.set('views', views_path)
hbs.registerPartials(partials_path)

app.listen(port, () => {
    console.log(`server is running at ${port}`)
})