const mongoose = require('mongoose');

mongoose.connect(process.env.DB_NAME, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(() => {
    console.log('database connection established')
}).catch(err => {
    console.log(err)
})