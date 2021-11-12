const { SearchClient, SearchIndexClient, SearchIndexerClient, AzureKeyCredential} = require("@azure/search-documents");
const { BlobServiceClient,StorageSharedKeyCredential, BlobClient,BlobSASPermissions } = require("@azure/storage-blob");
var atob = require('atob');
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
    const sas="?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2023-10-31T13:58:33Z&st=2021-11-12T05:58:33Z&sip=49.36.184.42&spr=https,http&sig=jqOCB1rep9waZAefU1DGPd6Omy6rmJGfutxknrCtguU%3D";
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${sas}`);
    const containerName = "uploadednotes";
    const containerClient=blobServiceClient.getContainerClient(containerName);
    async function search(){
        const searchResults = await searchClient.search(req.params.subject);
        for await (const result of searchResults.results) {
            console.log(result.document);
            if(result.document.verified==="true")
            {
            const blob_url=atob(result.document.metadata_storage_path).slice(0, -1);
            url=decodeURIComponent(blob_url)
            console.log(url);
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
            }
            results.push(blobobj);
            console.log(props);
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