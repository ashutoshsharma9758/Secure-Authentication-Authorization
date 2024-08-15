require('dotenv').config();
const express=require("express");
const app=express();
const cors=require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require('cookie-parser');
const auth= require("./routes/user.js");

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true // Allow credentials (cookies)
  }));
app.use(session({secret:"mysecret", resave: false, saveUninitialized:true}));
app.use(flash());

// Middleware for flash message
app.use((req, res, next)=>{
    res.locals.success= req.flash("success");
    res.locals.failure = req.flash("failure");
    next();
})

const port=8080;
const mongoose = require("mongoose");
const mongourl="mongodb://127.0.0.1:27017/auth";
async function main() {
    await mongoose.connect(mongourl);
    console.log("DB is connected");
  }
main().catch(err => console.log(err));

app.get("/", (req, res)=>{
    res.send("It is home route");
})
app.use('/user', auth);
app.listen(port, ()=>{
    console.log(`app is listening on ${port}`);
})
