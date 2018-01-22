var express=require("express"),
    router=express.Router(),
    User=require("../models/user.js"),
    passport=require("passport");

// register form
router.get("/register",function(req,res){
    res.render("register");
});
//sign up logic
router.post("/register",function(req,res){
    
    User.register({username:req.body.username},req.body.password,function(err,user){
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
//login handle logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){});
//logout
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You Out!!!");
    res.redirect("/campgrounds");
});

module.exports=router;