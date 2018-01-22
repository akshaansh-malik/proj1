//==============
//comment routes
//==============
var express=require("express"),
    router=express.Router(),
    Campground=require("../models/campgrounds.js"),
    middleware=require("../middleware/index.js"),
    Comment=require("../models/comment.js");
router.get("/campgrounds/:id/comment/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
});


router.post("/campgrounds/:id/comment",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    console.log(req.user);
                    var author={
                        id:req.user._id,
                        username:req.user.username
                    };
                    comment.author=author;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});
//EDIT ROUTE
router.get("/campgrounds/:id/comment/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    var campground_id=req.params.id;
    Comment.findById(req.params.comment_id,function(err,comment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:campground_id,comment:comment});    
        }
    });
    
});
//UPDATE
router.put("/campgrounds/:id/comment/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//DELETE    
router.delete("/campgrounds/:id/comment/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports=router;