var express=require("express"),
    router =express.Router(),
    middleware=require("../middleware/index.js"),
    Campground=require("../models/campgrounds.js"),
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

var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyCbAQEyMGakJz_1F7dgcKQ2W6e2x0wtm-Y', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);

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
    var gmail;
    User.find({email:req.user.email},function(err,response){
        if(err){
            console.log(err);
        }else{
            gmail=response.email;
        
        }
    });
    console.log(gmail);
    var place=req.body.place;
    var price=req.body.price;
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var lat;
    var lon;
    var author={
      id:req.user._id,
      username:req.user.username
    };
    geocoder.geocode(place, function(err, ans) {
    console.log(ans);
    lat=ans[0].latitude;
    lon=ans[0].longitude;
    //res.render('maps',{lat:ans[0].latitude,lon: ans[0].longitude});
  });
    var newcamp={name: name,image: image,description:desc,place:place,price:price,author:author,lat:lat,lon:lon};
    Campground.create(newcamp,function(err,campground){
        if(err){
            console.log(err);
        }else{
             const mailOptions = {
    to: gmail,
    subject: 'Campground Submitted',
    text: desc,
  };
  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent');
    }
  });
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
            geocoder.geocode(campground.place, function(err, ans) {
    console.log(ans);
    var lat;
    var lon;
    var result=[];
    lat=ans[0].latitude;
    lon=ans[0].longitude;
    result.push({lat:lat,lon:lon,place:campground.name});
    res.render("campgrounds/show",{campground:campground,result:result});
  });
            
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

router.get("/maps",function(req,res){
    
    
    Campground.find({},function(err,camps){
        if(err){
            console.log(err);
        }else{
            
            const places=[];
            const names=[];
            for(var i=0;i<camps.length;i++){
            places.push(camps[i].place);
                names.push(camps[i].name);
            }
            
              geocoder.batchGeocode(places, function(err, ans) {
                if(err){
                    console.log(err);
                }else{
                    console.log(ans);
                console.log(ans[0].value);
                const result=[];
    for(var i=0;i<ans.length;i++){
    var la=ans[i].value[0].latitude;
    var lo=ans[i].value[0].longitude;
    console.log(la+" "+lo+" "+names[i]);
    result.push({lat:la,lon:lo,place:names[i]});    
    }
    for(var j=0;j<result.length;j++)
     console.log(result[j]);
    res.render('maps',{result:result});
    
    
             
                }
        });    
            
            //console.log(camps);
     
    //  result.push({lat:32.2425758,lon:76.3212781});
       
            
        }
    });
    
    //res.render('maps',{lat:ans[0].latitude,lon: ans[0].longitude});
  });
  
  router.get('/maps/:id1/:id2',function(req,res){
      geocoder.reverse({lat:req.params.id1, lon:req.params.id2}, function(err, ans) {
  console.log(ans);
  Campground.find({place:ans[0].extra.neighborhood}).populate("comments").exec(function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log(campground);
            res.render("campgrounds/show",{campground:campground});
        }
    });
  
});
  });
  
router.post('/search',function(req,res){
   Campground.find({},function(err,camps){
        if(err){
            console.log(err);
        }else{
            
            const places=[];
            const names=[];
            for(var i=0;i<camps.length;i++){
            places.push(camps[i].place);
                names.push(camps[i].name);
            }
            places.push(req.body.search);
            
              geocoder.batchGeocode(places, function(err, ans) {
                if(err){
                    console.log(err);
                }else{
                    console.log(ans);
                console.log(ans[0].value);
                const result=[];
    for(var i=0;i<ans.length-1;i++){
    var la=ans[i].value[0].latitude;
    var lo=ans[i].value[0].longitude;
    console.log(la+" "+lo+" "+names[i]);
    result.push({lat:la,lon:lo,place:names[i]});    
    }
    var x=ans.length-1;
    var b={lat:ans[x].value[0].latitude,lon:ans[x].value[0].longitude,place:req.body.search};
    for(var j=0;j<result.length;j++)
     console.log(result[j]);
    res.render('maps1',{result:result,b:b});
    
    
             
                }
        });    
            
            //console.log(camps);
     
    //  result.push({lat:32.2425758,lon:76.3212781});
       
            
        }
    }); 
    
});  

router.get('/sendmail',middleware.isLoggedIn,function(req,res){
    var gmail;
    gmail=req.user.email;
   console.log('gmail'+" "+gmail);
           const mailOptions = {
               from: 'akshaanshmalik00@gmail.com',
    to: gmail,
    subject: 'Query Submitted',
    html: '<h1>Hello</h1>',
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, (error, response1) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent');
      res.redirect('/');
    }
  });
});

module.exports=router;

