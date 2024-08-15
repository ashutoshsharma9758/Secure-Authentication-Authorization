const express=require("express");
const User=require("../models/user.js");
const router= express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.use(express.urlencoded({extended:true}));
router.use(express.json());

router.post("/signup", async (req,res)=>{
    try{
        const {name, email, password} = req.body;
        let user= await User.findOne({email: email});
        if(user){
            req.flash("failure", "You already have an account, please login");
            return res.status(400).json({failure: req.flash("failure")});
        }
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(password, salt, async function (err, hash){
                if(err){
                    req.flash("failure", err.message);
                    return res.status(400).json({failure: req.flash("failure")});
                }
                else{
                    let user = await User.create({
                        email,
                        password:hash,
                        name,
                    });
                    let token = jwt.sign({email, id:user._id}, "myjwtsecret");
                    res.cookie("token", token,{
                        httpOnly: true,
                        secure: false, // Set to true if using HTTPS
                        sameSite: 'Lax',
                        domain: 'localhost', // Ensure the domain is correct
                        path: '/' 
                      });
                    if(!req.cookies.token){
                        console.log("cookie is not set");
                    }
                    else{
                        console.log("cookie is set");
                    }
                    console.log(`the token is ${token}`);
                    req.flash("success", "sccessfully registered");
                    return res.status(200).json({success: req.flash("success")});
                }
            });
        });
    }
    catch(err){
        req.flash("failure", err.message);
        return res.status(400).json({failure: req.flash("failure")});
    }
});

router.post("/login", async(req, res)=>{
    try{
        const {email, password}= req.body;
        let user = await User.findOne({email:email});
        if(!user){
            req.flash("failure", "Email or password incorrect");
            return res.status(400).json({failure: req.flash("failure")});
        }
        bcrypt.compare(password, user.password, function(err, result){
                if(result){
                    let token = jwt.sign({email, id:user._id}, "myjwtsecret");
                    res.cookie("token", token,{
                        httpOnly: true,
                        secure: false, // Set to true if using HTTPS
                        sameSite: 'Lax',
                        domain: 'localhost', // Ensure the domain is correct
                        path: '/' 
                      });
                      console.log("Cookies after setting token:", req.cookies);
                    // if(!req.cookies.token){
                    //     console.log("cookie is not set");
                    // }
                    // else{
                    //     console.log("cookie is set");
                    // }
                    // console.log(req.cookies);
                    console.log(`the token is ${token}`);
                    req.flash("success", "LoggedIn Successfully");
                    return res.status(200).json({success: req.flash("success")});
                }
                else{
                    req.flash("failure", "Email or password incorrect");
                    return res.status(400).json({failure: req.flash("failure")});
                }
        })
    }
    catch(err){
        res.status(500).json({failure:"Internal server error"});
    }
});

router.post("/logout", (req, res)=>{
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    return res.status(200).json({"success": req.flash("success")});
});

router.get("/check-auth", async(req, res)=>{
        if(!req.cookies.token){
            console.log("no token found");
            return res.status(400).json({success: false});
        }
        else{
            try{
                console.log("cookie is", req.cookies.token);
                let decoded= jwt.verify(req.cookies.token, "myjwtsecret");
                let user= await User.findOne({email:decoded.email}).select("-password");
                return res.status(200).json({success: true, user:user});
            } catch(err){
                return res.status(400).json({success: false});
            }
        }
    
    })
module.exports = router;