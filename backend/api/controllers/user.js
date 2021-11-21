var mongoose = require('mongoose');
const { NotesRead } = require('./notes');
var Users = mongoose.model('User');
var Notes = mongoose.model('notes');

module.exports.AddToFavourite=function(req,res){
    const user=req.body.user;
    const document=req.body.document.toString();
    console.log(user,document);
    Users.findById(user,function(err,result){
        console.log(result);
    if(!err){
        result.favourites.set(document,true);
        result.save();     
     res.setHeader('Content-Type', 'application/json');
     res.send(JSON.stringify({"added to favourites":true}));
    }
    else{
       console.log(err); 
    }
    })

   }

   module.exports.RemoveFromFavourite=function(req,res){
    const user=req.body.user;
    const document=req.body.document.toString();
    console.log(user,document);
    Users.findById(user,function(err,result){
        console.log(result);
    if(!err){
        result.favourites.set(document,false);
        result.save();     
     res.setHeader('Content-Type', 'application/json');
     res.send(JSON.stringify({"Removed from favourites":true}));
    }
    else{
       console.log(err); 
    }
    })
   }

   module.exports.GetAllFavourites=function(req,res){
    const user=req.params.id;
    Users.findById(user,function(err,result){
        let favouritesArray=[];
        console.log(result);
    if(!err){
        result.favourites.forEach((key,value)=>{
            if(key===true){
                console.log(value);
                favouritesArray.push(value);
            }
        })
     res.setHeader('Content-Type', 'application/json');
     res.send(JSON.stringify({"favourites":result.favourites}));
    }
    else{
       console.log(err); 
    }
    })
   }

   module.exports.Favourites=async function(req,response){
       const user=req.params.id;
       let promise= Users.findById(user);
       let favs=await promise.then((res)=>{
        let favourites=[];
        res.favourites.forEach((key,value)=>{
            if(key===true){
            favourites.push(value);
            }});
        return favourites;
       }).then(res=>{
          return res;
       });
        let prom=Notes.find({_id: {$in: favs}});
        let arr=await prom.then((results)=>{
            const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2021-11-19T21:25:02Z&st=2021-11-19T13:25:02Z&sip=49.36.186.248&spr=https,http&sig=ytqJeSkVdQQaQm%2FXPi%2F%2F%2FHQzuR8pfjmdHJ4UGBUXc2Y%3D";
            let favouritesArray=[];
            for(const result of results){
                if(result.verified===true){
                    console.log(result);
                    let obj={
                      "name":result.blobname,
                      "sasToken":sas, 
                      "url":result.document_url,
                      "filename":result.filename,
                      "year":result.year,
                      "major":result.major,
                      "subject":result.subject,
                      "verified":result.verified,
                      "ratings":result.rating,
                      "reviews":result.reviews,
                      "numReviews":result.numReviews,
                      "id":result._id,
                      "uploaded_date":result.verified_date
                    }
                    favouritesArray.push(obj);
                }
            } 
            return favouritesArray;
        });
         
       response.setHeader('Content-Type', 'application/json');
       response.send(JSON.stringify({"favourites":arr})); 
        
   }




