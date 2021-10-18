const { BlobServiceClient } = require("@azure/storage-blob");
const uploadFile = require("../middleware/upload");
const fs = require('fs');
const upload = async (req, res) => {

 
  try {

    await uploadFile(req, res);
    const path = req.file.path;
    const blobSasUrl="https://noteitdown.blob.core.windows.net/uploads?sp=racwdl&st=2021-10-18T17:42:25Z&se=2021-10-19T01:42:25Z&sv=2020-08-04&sr=c&sig=4Wyjgmk%2Fvt1Bx2jyAFmuQPzJXZQ0PikARrxX4BvBB6w%3D";
    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    const containerName=blobServiceClient.getContainerClient('uploads');
    const containerClient=blobServiceClient.getContainerClient(containerName);
    const blobName = `${req.body.year}/${req.body.major}/${req.body.subject}/${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.uploadFile(req.file.path);
    //console.log(uploadBlobResponse);
    //console.log(`FIle upload successfully on cloud ${uploadBlobResponse.requestId}`);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    }); 
  
    fs.unlinkSync(path);
  } catch (err) {

    res.status(500).send({ 
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};



module.exports={upload};