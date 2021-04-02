require('./config/config')
require('./models/db');
require('./config/passportConfig');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
var flash = require('express-flash');
const rtsIndex = require('./routes/index.router');
var session = require('express-session');
var async = require('async');
require('dotenv').config()
var app = express();


// middleware
app.use('/uploads',express.static('./uploads'));
app.use(session({ secret: 'session secret key' }));
app.use(flash());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);
app.use(flash());


// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));