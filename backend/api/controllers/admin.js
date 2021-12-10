const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient,StorageSharedKeyCredential, BlobClient,BlobSASPermissions } = require("@azure/storage-blob");
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var Documents = mongoose.model('notes');
var Users = mongoose.model('User');
module.exports.adminRead =function(req, res) {
    options={includeMetadata:true};
    AccountSASPermissions={
        add:true,
        create:true,
        delete:true,
        filter:true,
        list:true,
        read:true,
        tag:true,
        update:true,
    };
    let blobPermission=new BlobSASPermissions();
    blobPermission.add=true;
    blobPermission.delete=true;
    blobPermission.read=true;
    blobarray=[];
    const account = "noteitdown";
    const accountKey = "yjmDAvcxSxgYS6aijkUNUJeLZ6oWa23BLlmFDQByWcUHsIB05D6U1zgQHoqa3JiPoFTBG/C9SYKdaftmlKYMug==";
    //const connectionString="DefaultEndpointsProtocol=https;AccountName=noteitdown;AccountKey=yjmDAvcxSxgYS6aijkUNUJeLZ6oWa23BLlmFDQByWcUHsIB05D6U1zgQHoqa3JiPoFTBG/C9SYKdaftmlKYMug==;EndpointSuffix=core.windows.net";
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    //const blobServiceClient = new BlobServiceClient(
    //    `https://${account}.blob.core.windows.net`,
    //    sharedKeyCredential
    //  );
    
    const sharedAccessPolicy = {
            permissions: AccountSASPermissions,  
    };

    const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-01-29T14:24:25Z&st=2021-12-10T06:24:25Z&sip=0.0.0.0-255.255.255.255&spr=https,http&sig=tns4t766IuJynhbN9wzFP1Kq4hRqx8exMd4mFi751to%3D";
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
    const containerName = "uploadednotes";
    const containerClient=blobServiceClient.getContainerClient(containerName);
    async function main() {
   
    let blobs = containerClient.listBlobsFlat(options);
    let i=1;
    for await (const blob of blobs) {
        let startDate = new Date();
        startDate.setMinutes(startDate.getMinutes() - 5);
        let expiryDate = new Date(startDate);
        expiryDate.setMinutes(startDate.getMinutes() + 60);
        let options={
         permissions:blobPermission,
         protocol:"HTTPSandHTTP",
         ipRange:{
             start:"49.36.186.16",
         },
         expiresOn:expiryDate,
         startDate:startDate,
        }
        //console.log(`Blob ${i++}: ${blob.name}`);
        let blobclient=containerClient.getBlobClient(blob.name);
        if(blob.metadata.verified==="false"){
        let blobobj={
            "name":blob.name,
            "metadata":blob.metadata,
            "sasToken":sas, 
            "url":blobclient.url,
            "id":blob.metadata.mongo_db_id,
            "uploaded_by":blob.uploaded_by
        }
        blobarray.push(blobobj);
    }
        
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({"blobs":blobarray}));
      
}
main();
    res.status(200);
}

module.exports.sendMail=async function(req,res){
const user=req.body.user;
console.log(user);
let sendTo=await Users.findById(user).then((res)=>{
    console.log(res);
    return res.email;
})
console.log(sendTo);
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noteitdownapp@gmail.com',
    pass: 'oshinisbest'
  }
});

var mailOptions = {
  from: 'noteitdownapp@gmail.com',
  to: sendTo,
  subject: 'Regarding your recently uploaded notes',
  text: `Greetings from noteitdown,
  
         You recently uploaded notes on ${req.body.subject} with file name ${req.body.document}.
         We regret to inform you that the notes are not upto the mark and hence will not be verified.
         We hope you will continue uploading notes for the benefit of others.

         Regards,
         Team noteitdown
         `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}