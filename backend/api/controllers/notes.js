const { SearchClient, SearchIndexClient, SearchIndexerClient, AzureKeyCredential} = require("@azure/search-documents");
const { BlobServiceClient,StorageSharedKeyCredential, BlobClient,BlobSASPermissions } = require("@azure/storage-blob");
var atob = require('atob');
var mongoose = require('mongoose');
var Documents = mongoose.model('notes');
var Reviews = mongoose.model('reviews');
var elastic = require('../middleware/elasticSearch');



module.exports.NotesRead =function(req, res) {
    //console.log(req.params.subject);
    const api_key="3649D78D199321C6AF1B94CE712F8767";
    const searchClient = new SearchClient(
        "https://uploadsearchservice.search.windows.net",
        "azureblob-index",
        new AzureKeyCredential(api_key)
      );
    const account = "noteitdown";
    const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-03-04T05:44:46Z&st=2021-11-19T21:44:46Z&sip=49.36.186.248&spr=https,http&sig=LQNXcjaGCtdPhBv5Bio04VO2j5lmac6%2F5N9kxp%2FlTi8%3D";
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
    const containerName = "uploadednotes";
    const containerClient=blobServiceClient.getContainerClient(containerName);
    async function search(){
      
        //const searchResults = await searchClient.search(req.params.subject);
        const doc=Documents.find({  subject: {$eq:req.params.subject} } ,function(err, results) {
          let resultsArray=[];
          //console.log(results);
          for (const result of results){
            if(result.verified===true){
              //console.log("yes");
              //const blob= new BlobClient(url);
              //let blobclient=containerClient.getBlobClient(blob.name);
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
                resultsArray.push(obj);
            }
          }
          console.log(resultsArray);
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({"blobs":resultsArray})); 
        });
        
       
      }
        /*
        for await (const result of searchResults.results) {
            //console.log(result.document);
            if(result.document.verified==="true")
            {
            const blob_url=atob(result.document.metadata_storage_path).slice(0, -1);
            url=decodeURIComponent(blob_url)
            const blob= new BlobClient(url);
            let blobclient=containerClient.getBlobClient(blob.name);
            try{
            const props= await blobclient.getProperties();
            await Documents.findById(props.metadata.mongo_db_id,function(err,result){
            if(result){
            let blobobj={
                "name":blob.name,
                "sasToken":sas, 
                "url":blob.url,
                "filename":props.metadata.filename,
                "year":props.metadata.year,
                "major":props.metadata.major,
                "subject":props.metadata.subject,
                "verified":props.metadata.verified,
                "ratings":result.rating,
                "id":props.metadata.mongo_db_id}
            results.push(blobobj);
          }
        }) 
            }
            catch(err){
               console.log(err);
            }
            
        }
        }*/   
        
    
    search();
    
}

module.exports.CreateReview=function(req, res) {
async function create(){
 
  const document = Documents.findById(req.body.document,function(err,result){
    if (result) {
      const alreadyReviewed = result.reviews.find(
        (r) => r.user.toString() === req.body.user.toString()
      )
      if (alreadyReviewed) {
        console.log("cant add review");
        res.status(409).send('You have already added a review ');  
      }
      else{
      const review = {
      name: req.body.username,
      rating: Number(req.body.rating),
      comment:req.body.review,
      notesId:req.body.document,
      user:req.body.user, 
    }
    result.reviews.push(review);
    result.numReviews = result.reviews.length;
    result.rating = result.reviews.reduce((acc, item) => item.rating + acc, 0) /result.reviews.length
    result.save();
    res.status(201).json({ message: 'Review added' });
     }
    }
  });       
}
create();
}

module.exports.GetReviews=function(req,res){
  async function getreviews(){
    const document = Documents.findById(req.params.id,function(err,result){ 
    if(result){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({"reviews":result.reviews})); 
    }
    });
  }
  getreviews();

}

module.exports.VerifyNotes=function(req,res){
console.log(req.params.id);
Documents.findByIdAndUpdate(req.params.id,{verified:true,verified_date: new Date()}, function (err, docs) {
    if (err){
        console.log(err);
    }
    docs.index(function(err, res){
      console.log(" I've been indexed!");
    });
});
res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify({"verified":true}));

}
module.exports.DeleteNotes=function(req,res){
    console.log(req.params.id);
    Documents.findByIdAndRemove(req.params.id, function(err,data)
    {
        if(!err){
            console.log("Deleted");
        }
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({"deleted":true}));
    }

    module.exports.Search=function(req,res){

      const api_key="3649D78D199321C6AF1B94CE712F8767";
      const searchClient = new SearchClient(
          "https://uploadsearchservice.search.windows.net",
          "azureblob-index",
          new AzureKeyCredential(api_key)
        );
      const account = "noteitdown";
      const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2021-11-19T21:25:02Z&st=2021-11-19T13:25:02Z&sip=49.36.186.248&spr=https,http&sig=ytqJeSkVdQQaQm%2FXPi%2F%2F%2FHQzuR8pfjmdHJ4UGBUXc2Y%3D";
      const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
      const containerName = "uploadednotes";
      const containerClient=blobServiceClient.getContainerClient(containerName);
    console.log(req.body);
    Documents.findById(req.params.id,function(err,result){
      let resultsArray=[];
      if(!err){
        console.log("Found");
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
        resultsArray.push(obj);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"documents":resultsArray}));
    }
    });
    }



