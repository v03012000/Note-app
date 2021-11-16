const { SearchClient, SearchIndexClient, SearchIndexerClient, AzureKeyCredential} = require("@azure/search-documents");
const { BlobServiceClient,StorageSharedKeyCredential, BlobClient,BlobSASPermissions } = require("@azure/storage-blob");
var atob = require('atob');
var mongoose = require('mongoose');
var Documents = mongoose.model('notes');
var Reviews = mongoose.model('reviews');
module.exports.NotesRead =function(req, res) {
    //console.log(req.params.subject);
    const api_key="3649D78D199321C6AF1B94CE712F8767";
    const searchClient = new SearchClient(
        "https://uploadsearchservice.search.windows.net",
        "azureblob-index",
        new AzureKeyCredential(api_key)
      );
    const results=[];
    const account = "noteitdown";
    const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2023-06-26T22:34:06Z&st=2021-11-12T14:34:06Z&sip=49.36.186.4&spr=https,http&sig=CDgOpMdi%2Bb7Jw7kC2XuJLnEkojfUKlRZh6q2OfuSZ9g%3D";
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
    const containerName = "uploadednotes";
    const containerClient=blobServiceClient.getContainerClient(containerName);
    async function search(){
        const searchResults = await searchClient.search(req.params.subject);
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
            let blobobj={
                "name":blob.name,
                "sasToken":sas, 
                "url":blob.url,
                "filename":props.metadata.filename,
                "year":props.metadata.year,
                "major":props.metadata.major,
                "subject":props.metadata.subject,
                "verified":props.metadata.verified,
                "ratings":1,
                "id":props.metadata.mongo_db_id,

            }
            results.push(blobobj);
            }
            catch(err){
               console.log(err);
            }
            
        }
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"blobs":results}));    
        
    }
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

module.exports.VerifyNotes=function(req,res){
console.log(req.params.id);
Documents.findByIdAndUpdate(req.params.id,{verified:true}, function (err, docs) {
    if (err){
        console.log(err);
    }
    
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
    res.send();
    res.send(JSON.stringify({"deleted":true}));

    }

