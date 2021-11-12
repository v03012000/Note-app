var mongoose = require('mongoose');
var Documents = mongoose.model('notes');
const { BlobServiceClient,StorageSharedKeyCredential  } = require("@azure/storage-blob");
const util = require("util");
const multer = require("multer");
const path=require('path');
const uploadFile = require("../middleware/upload");
const fs = require('fs');

const upload = async (req, res) => {

  try {

    await uploadFile(req, res);
    //console.log(req);
    const path = req.file.path;
    const account = "noteitdown";
    const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2023-10-31T13:58:33Z&st=2021-11-12T05:58:33Z&sip=49.36.184.42&spr=https,http&sig=jqOCB1rep9waZAefU1DGPd6Omy6rmJGfutxknrCtguU%3D";
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
    const containerName = "uploadednotes";
    const containerClient=blobServiceClient.getContainerClient(containerName);
    const d=new Date().getTime();
    const blobName = `${req.body.year}_${req.body.major}_${req.body.subject}_${d}_${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const blobOptions = { blobHTTPHeaders: { blobContentType: 'application/pdf', blobContentDisposition:"attachment" }};
    const uploadBlobResponse = await blockBlobClient.uploadFile(req.file.path,blobOptions);
    blockBlobClient.setMetadata({"year":req.body.year,"major":req.body.major,"subject":req.body.subject,"filename":req.file.originalname,"verified":"false"});
    var document = new Documents();
    document.document_url=blockBlobClient.url;
    document.filename=req.file.originalname;
    document.blobname=blobName;
    document.verified=false;
    document.save(function (err) {
      if (err) return handleError(err);
    });
    console.log(`FIle upload successfully on cloud ${uploadBlobResponse.requestId}`);
    if(!req.file) {
      return res.send('Please select an image to upload');
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




