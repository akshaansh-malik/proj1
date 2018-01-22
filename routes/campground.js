var express=require("express"),
    router =express.Router(),
    middleware=require("../middleware/index.js"),
    Campground=require("../models/campgrounds.js");

router.get("/",function(req,res){
    res.render("landing");
});
router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{ campgrounds:campgrounds});
        }
    });
    
});

router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
      id:req.user._id,
      username:req.user.username
    };
    var newcamp={name: name,image: image,description:desc,author:author};
    Campground.create(newcamp,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
    
});

router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log(campground);
            res.render("campgrounds/show",{campground:campground});
        }
    });
});
//edit
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
        res.render("campgrounds/edit",{campground:campground});        
        }
        
    });
});
//update
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,campground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//delete
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});



module.exports=router;

