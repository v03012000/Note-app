var mongoose = require('mongoose');
var User = mongoose.model('User');
const { SearchClient, SearchIndexClient, SearchIndexerClient, AzureKeyCredential} = require("@azure/search-documents");
module.exports.homeRead = function(req, res) {
 
const api_key="3649D78D199321C6AF1B94CE712F8767";
const searchClient = new SearchClient(
    "https://uploadsearchservice.search.windows.net",
    "azureblob-index",
    new AzureKeyCredential(api_key)
  );
  
async function search() {
    const result = await searchClient.getDocumentsCount();
    console.log(result);
  }
  
  search();

};