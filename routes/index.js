var express=require("express"),
    router=express.Router(),
    User=require("../models/user.js"),
    passport=require("passport");
   User=require("../models/user.js");
    var NodeGeocoder = require('node-geocoder'),
    nodemailer=require('nodemailer');
 const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'akshaanshmalik00@gmail.com',
    pass: '10p15pk0099',
  },
});
   
   
   
   
// register form
router.get("/register",function(req,res){
    res.render("register");
});
//sign up logic
router.post("/register",function(req,res){
    
    User.register({username:req.body.username,email:req.body.email},req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.redirect("/register");
       } 
       passport.authenticate("local")(req,res,function(){
           res.redirect("/campgrounds");
       });
    });
});
//login 
router.get("/login",function(req,res){
    res.render("login");
});
var gmail;
//login handle logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
});
//logout
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out!!!");
    res.redirect("/campgrounds");
});
module.exports=router;