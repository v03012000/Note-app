const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient,StorageSharedKeyCredential, BlobClient,BlobSASPermissions } = require("@azure/storage-blob");


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
    //console.log(blobServiceClient.url);
    //const sasToken=blobServiceClient.generateAccountSasUrl(sharedAccessPolicy);
    //console.log(sasToken);
    const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2023-10-31T13:58:33Z&st=2021-11-12T05:58:33Z&sip=49.36.184.42&spr=https,http&sig=jqOCB1rep9waZAefU1DGPd6Omy6rmJGfutxknrCtguU%3D";
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