const { SearchClient, SearchIndexClient, SearchIndexerClient, AzureKeyCredential} = require("@azure/search-documents");
const api_key="3649D78D199321C6AF1B94CE712F8767";
const searchClient = new SearchClient(
    "https://uploadsearchservice.search.windows.net",
    "azureblob-index",
    new AzureKeyCredential(api_key)
  );
async function main() {
    const result = await searchClient.getDocumentsCount();
    console.log(result);
  }
  
  main();
/*var elastic=require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
    });

client.ping({
    requestTimeout: 30000,
    }, function (error) {
    if (error) {
    console.error('elasticsearch cluster is down!');
    } else {
    console.log('All is well');
    }
    });


client.indices.create({
    index: 'verifieduploads'
}, function(err, resp, status) {
    if (err) {
        console.log(err);
    } else {
        console.log("create", resp);
    }
});*/



