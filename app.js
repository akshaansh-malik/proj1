var express=require("express"),
    app=express(),
    mongoose=require("mongoose"),
    Campground=require("./models/campgrounds.js"),
    Comment=require("./models/comment.js"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    User=require("./models/user.js"),
    seedDB=require("./seed"),
    methodOverride=require("method-override"),
    campgroundRoutes=require("./routes/campground.js"),
    commentRoutes=require("./routes/comment.js"),
    flash        =require("connect-flash"),
    indexRoutes=require("./routes/index.js");
    mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

app.use(methodOverride("_method"));
app.use(flash());
//================
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"ronaldo",
    resave :false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//================


app.set("view engine","ejs");
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
   // seedDB();//seeding database
   
   
app.use(function(req,res,next){
//    console.log(req.user);
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyCbAQEyMGakJz_1F7dgcKQ2W6e2x0wtm-Y', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);
 
// Using callback

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);






app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server has started"); 
});