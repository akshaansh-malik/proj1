var Campground=require("./models/campgrounds"),
    Comment=require("./models/comment");

var data=[
    {
        name:"HELL",
        image:"https://www.yellowstonenationalparklodges.com/content/uploads/2017/04/madison-campground-1024x768.jpg",
        description:"blah blah"
    },
    {
        name:"Yorkshire",
        image:"http://www.exploresquamish.com/files/dmo_listing_and_extra_images/Stawamus-Chief-Campground-1500x1000.jpg",
        description:"blah blah"
    },
    {
        name:"Newt",
        image:"https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1440478008/campground-photos/csnhvxn0qcki2id5vxnc.jpg",
        description:"blah blah"
    }
    ];

function seed(){
        Campground.remove({},function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("campgrounds removed");
            }
        });
        // data.forEach(function(seed){
        //     Campground.create(seed,function(err,campground){
        //         if(err){
        //             console.log(err);
        //         }else{
        //             console.log("added");
        //             Comment.create({
        //                 text:"wish i have net",
        //                 author:"broke"
        //             },function(err,comment){
        //                 if(err){
        //                     console.log(err);
        //                 }else{
        //                     campground.comments.push(comment);
        //                     campground.save();
        //                     console.log("new comment created");
        //                 }
        //             });
        //         }
        //     });
        // });
}
module.exports=seed;