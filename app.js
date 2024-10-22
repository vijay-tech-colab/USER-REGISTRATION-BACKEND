const cookieParser = require('cookie-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const router = require('./routers/userRouter');
const app = express();
require('dotenv').config({path : "./config/config.env"});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : true}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/api/v1/user/',router);

module.exports = app