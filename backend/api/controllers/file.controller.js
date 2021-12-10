var mongoose = require('mongoose');
var Documents = mongoose.model('notes');
var Users = mongoose.model('User');
const { BlobServiceClient,StorageSharedKeyCredential  } = require("@azure/storage-blob");
const util = require("util");
const multer = require("multer");
const path=require('path');
const uploadFile = require("../middleware/upload");
const fs = require('fs');

const upload = async (req, res) => {

  try {

    const log= await uploadFile(req, res);
    console.log(log);
    const path = req.file.path;
    const account = "noteitdown";
    const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-01-29T14:24:25Z&st=2021-12-10T06:24:25Z&sip=0.0.0.0-255.255.255.255&spr=https,http&sig=tns4t766IuJynhbN9wzFP1Kq4hRqx8exMd4mFi751to%3D";
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
    const containerName = "uploadednotes";
    const containerClient=blobServiceClient.getContainerClient(containerName);
    const d=new Date().getTime();
    const blobName = `${req.body.year}_${req.body.major.replace(/\s/g, "")}_${req.body.subject.replace(/\s/g, "")}_${d}_${req.file.originalname.replace(/\s/g, "")}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobOptions = { blobHTTPHeaders: { blobContentType: 'application/pdf', blobContentDisposition:"attachment" }};
    const uploadBlobResponse = await blockBlobClient.uploadFile(req.file.path,blobOptions);
    console.log(uploadBlobResponse);
    const id= await Users.findById(req.body.uploaded_by).then((res)=>{
      return res });
    console.log(id._id);
    var document = new Documents();
    document.document_url=blockBlobClient.url;
    document.filename=req.file.originalname;
    document.blobname=blobName;
    document.verified=false;
    document.subject=req.body.subject;
    document.year=req.body.year;
    document.major=req.body.major;
    document.uploaded_by=id._id;
    document.save(function (err) {
      if (err) {
        res.send('Error occured while uploading the file');
        return handleError(err);
      }

      else{
        blockBlobClient.setMetadata({"year":req.body.year,"major":req.body.major,"subject":req.body.subject,"filename":req.file.originalname,"verified":"false","mongo_db_id":document._id,"uploaded_by":id._id});
      }
    });
    console.log(`FIle upload successfully on cloud ${uploadBlobResponse.requestId}`);
    if(!req.file) {
      return res.send('Please select a file to upload');
  }
  
    fs.unlinkSync(path);
  } catch (err) {
    if (err instanceof multer.MulterError) {
      return res.send(err);
  }
  else{
    res.send(err);
  }

  
    
  }
};



module.exports={upload};




