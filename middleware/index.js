var Campground=require("../models/campgrounds.js"),
    Comment   =require("../models/comment.js");
var middleware={};

middleware.checkCampgroundOwnership=function(req,res,next){
    console.log(req.user);
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,campground){
            if(err){
                res.redirect("back");
            }else{
                if(campground.author.id.equals(req.user._id))
                return next();
                else
                res.redirect("back");
            }
        });
    }
    else{
        res.redirect("back");
    }
}
middleware.checkCommentOwnership=function(req,res,next){
    console.log(req.user);
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,comment){
            if(err){
                res.redirect("back");
            }else{
                if(comment.author.id.equals(req.user._id))
                return next();
                else
                res.redirect("back");
            }
        });
    }
    else{
        res.redirect("back");
    }
}

middleware.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You Have to Login");
    res.redirect("/login");
}
module.exports=middleware;
