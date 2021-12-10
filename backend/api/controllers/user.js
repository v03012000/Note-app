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

        if(result.favourites){
            result.favourites.set(document,true);
        }
        else{
         result.favourites=new Map();
         result.favourites.set(document,true);
        }

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
        result.favourites?.forEach((key,value)=>{
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
            const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-01-29T14:24:25Z&st=2021-12-10T06:24:25Z&sip=0.0.0.0-255.255.255.255&spr=https,http&sig=tns4t766IuJynhbN9wzFP1Kq4hRqx8exMd4mFi751to%3D";
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

   module.exports.InsertDummyData=async function(req,res){

    function getRandomDate() {
        var nr_days1 = 30*365;
        var nr_days2 = -20*365;
        var one_day=1000*60*60*24
        var days = getRandomInt(nr_days2, nr_days1);
        return new Date(days*one_day)
    }
    let arr=[];
    for(let i=25;i<1050;i++)
    {
    let user={
        email:"user"+i+"@gmail.com",
        password:"oshinisbest",
        username:"user"+i,
        role:"user"
    };
    arr.push(user);
    }
    await Users.create(arr).then(function(){
        console.log("Data inserted")  // Success
    }).catch(function(error){
        console.log(error)      // Failure
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({"done":arr})); 
   }







