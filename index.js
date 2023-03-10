var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan')
var app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
var cors = require('cors');
app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.json()); 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
const mongoDB = process.env.MONGODB_URL
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// for parsing application/json
db.once('open',()=>{
    console.log('database mongo connected')
})

const authrouter=require('./app/routes/auth')
app.use("/api/v1",authrouter)
const playerrouter=require('./app/routes/player')
app.use('/api/v1',playerrouter)

const PORT =process.env.PORT ||5000
app.listen(PORT, ()=>{
    console.log(`server is running ${PORT}`)
})